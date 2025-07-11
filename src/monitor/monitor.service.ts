import { Injectable } from '@nestjs/common';
import { LogDTO } from './dto/monitor.dto';
import { pageProps } from '../types/page';
import { RedisService } from '../config/redis/redis.service';
import { AddLogProps } from './monitor.type';
import { TYPES } from '../utils/constants/monitor';
import { MonitorEvents } from './schema/MonitorEvents.schema';
import { MonitorUser } from './schema/MonitorUser.schema';
import { MonitorSession } from './schema/MonitorSession.schema';

const SESSION_TIMEOUT = 30 * 60 * 1000;

@Injectable()
export class MonitorService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * 添加埋点数据
   * @param data 埋点数据
   * @param sessionId 会话 ID
   * @param platform 平台信息
   */
  async addData(
    data: LogDTO[],
    sessionId: string,
    projectId: string,
    platform: string,
  ) {
    try {
      await this.handleAddData(data, sessionId, projectId, platform);
      return { success: true };
    } catch (error) {
      console.error('Error adding data:', error);
      throw new Error('Failed to add data');
    }
  }

  /**
   * 查询数据列表
   * @param query 分页查询参数
   */
  async getDataList(query: pageProps) {
    // 查询数据逻辑
    console.log(query);
    // TODO: 实现具体查询逻辑
    return {
      query,
      res: {
        mock: '123',
      },
    };
  }

  /**
   * 处理并存储埋点数据到 Redis
   * @param data 埋点数据
   * @param sessionId 会话 ID
   * @param platform 平台信息
   */
  async handleAddData(
    data: LogDTO[],
    sessionId: string,
    projectId: string,
    platform: string,
  ) {
    try {
      const logs = await this.redisService.get('monitor-log');
      const monitorData = logs
        ? [{ data, sessionId, projectId, platform }, ...logs]
        : [{ data, sessionId, projectId, platform }];
      await this.redisService.set('monitor-log', monitorData, 86400); // 存储 24 小时
    } catch (error) {
      console.error('Error handling add data:', error);
      throw new Error('Failed to handle add data');
    }
  }

  /**
   * 处理 Redis 中的数据，转换为结构化数据
   * @param monitorData Redis 中的原始数据
   * @returns 结构化数据
   */
  async handleRedisData(monitorData: AddLogProps[]): Promise<{
    eventDataList: MonitorEvents[];
    userDataList: MonitorUser[];
    sessionDataList: MonitorSession[];
  }> {
    const eventDataList: MonitorEvents[] = [];
    const userDataList: MonitorUser[] = [];
    const sessionDataList: MonitorSession[] = [];

    try {
      monitorData?.forEach((monitorItem) => {
        const { sessionId, platform, projectId, data } = monitorItem;
        // 提取用户信息
        const userInfo = data.find(
          (item) => item.type.value === TYPES.USERINFO.value,
        );
        const userId = userInfo?.userId || 'anonymous';
        const userName = userInfo?.userName || 'anonymous';

        // 初始化用户数据
        const userData: any = {
          userId,
          userName,
          projectId: '',
          lastActiveTime: 0,
          attributes: {},
          sessions: [sessionId],
        };

        // 初始化会话数据
        const sessionData: any = {
          _id: sessionId,
          platform,
          userId: userId,
          startTime: 0,
          endTime: 0,
          timezone: '',
          language: '',
          deviceInfo: {
            type: '',
            os: '',
            browser: '',
            resolution: '',
          },
          locationInfo: {
            country: '',
            province: '',
            city: '',
            ip: '',
          },
          events: [],
        };

        let maxEventTime = 0;
        // 处理每个事件
        data.forEach((item) => {
          if (item.time > maxEventTime) {
            maxEventTime = item.time;
          }
          const eventData: any = {
            sessionId,
            userId,
            projectId,
            eventType: item.type.value,
            eventName: item.type.text,
            eventLevel: item.level.value,
            pageUrl: item.info?.pageUrl || '',
            pageTitle: item.info?.pageTitle || '',
            createTime: item.time,
            eventData: item.data,
          };
          eventDataList.push(eventData);

          // 更新用户数据
          if (!userData.projectId) {
            userData.projectId = projectId;
          }
          userData.lastActiveTime = Math.max(
            userData.lastActiveTime,
            item.time,
          );

          // 更新会话数据
          if (!sessionData.timezone && !sessionData.language) {
            sessionData.timezone = item.info?.timezone || '+8';
            sessionData.language = item.info?.language || 'en';
            sessionData.deviceInfo = item.info?.deviceInfo || {};
            sessionData.locationInfo = item.info?.locationInfo || {};
          }
          sessionData.events.push(eventData);
          sessionData.endTime = maxEventTime + SESSION_TIMEOUT;
        });
      });
      return { eventDataList, userDataList, sessionDataList };
    } catch (error) {
      console.error('Error handling Redis data:', error);
      throw new Error('Failed to handle Redis data');
    }
  }
}
