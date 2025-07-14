import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '../../config/redis/redis.service';
import { MonitorEvents } from '../../monitor/schema/MonitorEvents.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitorSession } from '../../monitor/schema/MonitorSession.schema';
import { MonitorUser } from '../../monitor/schema/MonitorUser.schema';
import { MonitorService } from '../../monitor/monitor.service';

@Injectable()
export class MonitorTask {
  constructor(
    private readonly redisService: RedisService,
    private readonly monitorService: MonitorService,

    @InjectModel('MonitorEvents')
    private readonly monitorEventsModel: Model<MonitorEvents>,
    @InjectModel('MonitorSession')
    private readonly monitorSessionModel: Model<MonitorSession>,
    @InjectModel('MonitorUser')
    private readonly monitorUserModel: Model<MonitorUser>,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const MAIN_KEY = 'monitor-log';
    const LOCK_KEY = 'monitor-log-lock';
    const PROCESSING_KEY = 'monitor-log-processing';

    // 分布式锁
    const lockAcquired = await this.redisService.set(
      LOCK_KEY,
      '1',
      300, // 锁超时时间（秒）
    );

    if (!lockAcquired) {
      console.log('已有处理进程运行中，跳过本次执行');
      return;
    }

    try {
      // 原子性地重命名当前key
      await this.redisService.rename(MAIN_KEY, PROCESSING_KEY);

      // 处理数据
      const processingData = await this.redisService.lrange(
        PROCESSING_KEY,
        0,
        -1,
      );
      if (!processingData?.length) {
        console.log('无待处理数据');
        return;
      }

      const parseProcessingData = processingData.map((item) =>
        JSON.parse(item),
      );

      try {
        const { eventDataList, userDataList, sessionDataList } =
          await this.monitorService.handleRedisData(parseProcessingData);

        // MonitorEvents
        const events = await this.monitorEventsModel.insertMany(eventDataList);

        // MonitorUser
        const userBulkOps = userDataList.map((userData) => ({
          updateOne: {
            filter: {
              userId: userData.userId,
              projectId: userData.projectId,
            },
            update: {
              $setOnInsert: {
                userId: userData.userId,
                userName: userData.userName,
                projectId: userData.projectId,
                attributes: userData.attributes,
              },
              $set: { lastActiveTime: userData.lastActiveTime },
              $addToSet: { sessions: { $each: userData.sessions } },
            },
            upsert: true,
          },
        }));

        // MonitorSession
        const sessionBulkOps = sessionDataList.map((sessionData) => ({
          updateOne: {
            filter: { sessionId: sessionData.sessionId },
            update: {
              $setOnInsert: {
                sessionId: sessionData.sessionId,
                platform: sessionData.platform,
                startTime: sessionData.startTime,
                timezone: sessionData.timezone,
                language: sessionData.language,
                deviceInfo: sessionData.deviceInfo,
                userId: sessionData.userId,
              },
              $set: { endTime: sessionData.endTime },
              $addToSet: {
                events: {
                  $each: events
                    .filter((e) => e.sessionId === sessionData.sessionId)
                    .map((e) => e._id),
                },
              },
            },
            upsert: true,
          },
        }));

        await Promise.all([
          this.monitorUserModel.bulkWrite(userBulkOps),
          this.monitorSessionModel.bulkWrite(sessionBulkOps),
        ]);

        await this.redisService.del(PROCESSING_KEY);
        console.log(`成功处理 ${events.length} 条事件数据`);
      } catch (err) {
        console.error('数据存储失败:', err);
        const remainingCount = await this.redisService.llen(PROCESSING_KEY);
        if (remainingCount > 0) {
          await this.redisService.lpush(
            MAIN_KEY,
            ...(await this.redisService.lrange(PROCESSING_KEY, 0, -1)),
          );
        }
      }
    } finally {
      await this.redisService.del(LOCK_KEY);
    }
  }
}
