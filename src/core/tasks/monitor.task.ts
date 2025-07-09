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
      console.log(parseProcessingData, processingData);
      try {
        const { eventDataList, userDataList, sessionDataList } =
          await this.monitorService.handleRedisData(parseProcessingData);

        // 存储相关数据
        const session = await this.monitorEventsModel.db.startSession();
        session.startTransaction();

        try {
          // 存储MonitorUser
          for (const userData of userDataList) {
            const existingUser = await this.monitorUserModel
              .findOne({
                userId: userData.userId,
                projectId: userData.projectId,
              })
              .session(session);
            if (existingUser) {
              // 更新用户数据
              existingUser.lastActiveTime = userData.lastActiveTime;
              existingUser.sessions.push(...userData.sessions);
              await existingUser.save({ session });
            } else {
              // 创建新用户
              const newUser = new this.monitorUserModel(userData);
              await newUser.save({ session });
            }
          }
          // 存储MonitorSession
          for (const sessionData of sessionDataList) {
            const existingSession = await this.monitorSessionModel
              .findById(sessionData._id)
              .session(session);

            if (existingSession) {
              // 更新会话数据
              existingSession.endTime = sessionData.endTime;
              existingSession.events.push(...sessionData.events);
              await existingSession.save({ session });
            } else {
              // 创建新会话
              const newSession = new this.monitorSessionModel(sessionData);
              await newSession.save({ session });
            }
          }
          // 存储 MonitorEvents
          await this.monitorEventsModel.insertMany(eventDataList);

          // 提交事务
          await session.commitTransaction();
          session.endSession();

          await this.redisService.del(PROCESSING_KEY);
        } catch (error) {
          // 回滚事务
          await session.abortTransaction();
          session.endSession();
          console.error('Error saving data to MongoDB:', error);

          await this.redisService.lpush(MAIN_KEY, ...processingData);
          throw new Error('Failed to save data to MongoDB');
        }
      } catch (err) {
        console.error('数据处理失败:', err);
      }
    } finally {
      await this.redisService.del(LOCK_KEY);
    }
  }
}
