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
      const { eventDataList /* , userDataList, sessionDataList */ } =
        await this.monitorService.handleRedisData(monitorLog);
      // 存储event相关数据
      console.log(
        this.monitorEventsModel,
        this.monitorSessionModel,
        this.monitorUserModel,
      );
      await this.monitorEventsModel.insertMany(eventDataList);
      // for (const log of logDocuments) {
      //   // 存储会话相关数据
      //   let session = await this.monitorSessionModel.findOne({
      //     _id: log.sessionId,
      //   });
      //   if (!session) {
      //     session = new this.monitorSessionModel({
      //       _id: log.sessionId,
      //       platform: log.platform,
      //       startTime: new Date(log.timestamp),
      //       deviceInfo: log.deviceInfo,
      //       locationInfo: log.locationInfo,
      //       userId: log.userId,
      //     });
      //     await session.save();
      //   } else {
      //     await session.updateOne({
      //       $set: {
      //         endTime: new Date(log.timestamp), // 还需额外写逻辑判断
      //         deviceInfo: log.deviceInfo,
      //         locationInfo: log.locationInfo,
      //       },
      //       $addToSet: { events: insertedEvents.map((event) => event._id) },
      //     });
      //   }

      //   // 存储用户相关数据
      //   let user = await this.monitorUserModel.findOne({
      //     userId: log.userId,
      //     projectId: log.projectId,
      //   });
      //   if (!user) {
      //     user = new this.monitorUserModel({
      //       userId: log.userId,
      //       projectId: log.projectId,
      //       name: log.userName, // 假设日志中包含 userName
      //       lastActiveTime: new Date(log.timestamp),
      //       attributes: log.attributes,
      //     });
      //     await user.save();
      //   } else {
      //     await user.updateOne({
      //       $set: {
      //         lastActiveTime: new Date(log.timestamp),
      //         attributes: log.attributes,
      //       },
      //       $addToSet: { sessions: session._id },
      //     });
      //   }
      // }
    }

    // 删除redis缓存的埋点数据
    await this.redisService.del('monitor-log');
  }
}
