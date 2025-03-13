import { Injectable } from '@nestjs/common';
import { LogDTO } from './dto/monitor.dto';
import { pageProps } from 'src/types/page';
import { RedisService } from 'src/config/redis/redis.service';
import { AddLogProps } from './monitor.type';
import { TYPES } from 'src/utils/constants/monitor';

@Injectable()
export class MonitorService {
  constructor(private readonly redisService: RedisService) {}

  async addData(data: LogDTO[], sessionId: string, platform: string) {
    // 写入
    await this.handleAddData(data, sessionId, platform);
  }

  async getDataList(query: pageProps) {
    // 查询数据逻辑
    console.log(query);
  }

  async handleAddData(data: LogDTO[], sessionId: string, platform: string) {
    let monitorData = [];
    const logs = await this.redisService.get('monitor-log');
    if (logs) {
      monitorData = [{ data, sessionId, platform }, ...logs];
      await this.redisService.del('monitor-log');
    } else {
      monitorData = [{ data, sessionId, platform }];
    }
    await this.redisService.set('monitor-log', monitorData, 86400); // 存储 24 小时
    return { success: true };
  }

  async handleRedisData(monitorData: AddLogProps[]) {
    const eventDataList: any = [];
    const userDataList: any = [];
    const sessionDataList: any = [];
    monitorData?.forEach((monitorItem) => {
      const sessionId = monitorItem.sessionId;
      const platform = monitorItem.platform;
      // 处理用户相关数据
      const userInfo = monitorItem?.data.find(
        (item) => item.type.value === TYPES.USERINFO.value,
      );
      const userData = {
        userId: userInfo?.userId || 'anonymous',
        userName: userInfo?.userName || 'anonymous',
        projectId: '',
        lastActiveTime: Date.now(),
        attributes: {},
        sessionId,
      };
      // 处理会话相关数据
      const sessionData = {
        platform,
        sessionId,
        userId: userInfo?.userId || 'anonymous',
        startTime: 0,
        endTime: 0,
        timezone: '',
        language: '',
        deviceInfo: {},
        locationInfo: {},
      };
      // 处理事件相关数据
      monitorItem?.data.forEach((item) => {
        const eventData = {
          userId: userInfo?.userId || 'anonymous',
          userName: userInfo?.userName || 'anonymous',
          sessionId: sessionId,
          projectId: item.projectId,
          eventType: item.type.value,
          eventName: item.type.text,
          eventLevel: item.level,
          pageUrl: item.info?.pageUrl || '',
          pageTitle: item.info?.pageTitle || '',
          createTime: item.time,
          eventData: item.data,
        };
        eventDataList.push(eventData);
        if (!userData.projectId) {
          userData.projectId = item.projectId;
        }
        if (!sessionData.timezone && !sessionData.language) {
          sessionData.timezone = item.info?.timezone || '+8';
          sessionData.language = item.info?.language || 'en';
          sessionData.deviceInfo = item.info?.deviceInfo;
          sessionData.locationInfo = item.info?.locationInfo;
        }
        userData.lastActiveTime = Math.max(userData.lastActiveTime, item.time);
      });
      userDataList.push(userData);
      sessionDataList.push(sessionData);
    });
    return { eventDataList, userDataList, sessionDataList };
  }
}
