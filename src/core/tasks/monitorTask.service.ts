import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '../../config/redis/redis.service';
import { MonitorEvents } from '../../monitor/schema/MonitorEvents.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitorSession } from 'src/monitor/schema/MonitorSession.schema';
import { MonitorUser } from 'src/monitor/schema/MonitorUser.schema';
import { MonitorService } from 'src/monitor/monitor.service';

@Injectable()
export class MonitorTaskService {
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
    const monitorLog = await this.redisService.get('monitor-log');
    if (monitorLog) {
      // 处理数据
      const { eventDataList, userDataList, sessionDataList } =
        await this.monitorService.handleRedisData(monitorLog);
      // 存储相关数据
      const session = await this.monitorEventsModel.db.startSession();
      session.startTransaction();
      try {
        // 存储MonitorUser
        for (const userData of userDataList) {
          const existingUser = await this.monitorUserModel
            .findOne({ userId: userData.userId, projectId: userData.projectId })
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
      } catch (error) {
        // 回滚事务
        await session.abortTransaction();
        session.endSession();
        console.error('Error saving data to MongoDB:', error);
        throw new Error('Failed to save data to MongoDB');
      }
    }

    // 删除redis缓存的埋点数据
    await this.redisService.del('monitor-log');
  }
}
