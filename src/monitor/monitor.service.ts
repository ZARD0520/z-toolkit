import { Injectable } from '@nestjs/common';
import { LogDTO } from './dto/monitor.dto';
import { pageProps } from '../common/types/pagination.type';
import { RedisService } from '../config/redis/redis.service';
import { AddLogProps } from './monitor.type';
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
      const logs = await this.redisService.lrange('monitor-log', 0, -1);
      const monitorData = logs
        ? [JSON.stringify({ data, sessionId, projectId, platform }), ...logs]
        : [JSON.stringify({ data, sessionId, projectId, platform })];
      await this.redisService.rpush('monitor-log', ...monitorData);
      await this.redisService.expire('monitor-log', 86400); // 存储 24 小时
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

        // 初始化会话数据
        const sessionData: any = {
          sessionId: sessionId,
          platform,
          userIds: [],
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
          // 用户信息
          const userId = item.info?.userInfo?.userId || 'anonymous';
          const userName = item.info?.userInfo?.userName || 'anonymous';

          // 查找
          let userData: any = userDataList.find((u) => u.userId === userId);
          if (!userData) {
            userData = {
              userId,
              userName,
              projectId: projectId,
              lastActiveTime: item.time,
              attributes: {},
              sessions: [sessionId],
            };
            userDataList.push(userData);
          } else {
            // 更新现有用户数据
            userData.lastActiveTime = Math.max(
              userData.lastActiveTime,
              item.time,
            );
            if (!userData.sessions.includes(sessionId)) {
              userData.sessions.push(sessionId);
            }
          }

          // 设置会话的用户ID
          if (!sessionData.userIds.includes(userId)) {
            sessionData.userIds.push(userId);
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

          // 更新会话数据
          if (!sessionData.timezone && !sessionData.language) {
            sessionData.timezone = item.info?.timezone || '+8';
            sessionData.language = item.info?.language || 'en';
            sessionData.deviceInfo = item.info?.deviceInfo || {};
            sessionData.locationInfo = item.info?.locationInfo || {};
          }
          sessionData.startTime = maxEventTime;
          sessionData.endTime = maxEventTime + SESSION_TIMEOUT;
        });
        sessionDataList.push(sessionData);
      });
      return { eventDataList, userDataList, sessionDataList };
    } catch (error) {
      console.error('Error handling Redis data:', error);
      throw new Error('Failed to handle Redis data');
    }
  }
}
