import { Injectable } from '@nestjs/common';
import { LogDTO } from './dto/monitor.dto';
import { pageProps } from 'src/types/page';
import { RedisService } from 'src/config/redis/redis.service';

@Injectable()
export class MonitorService {
  constructor(private readonly redisService: RedisService) {}

  async addData(data: LogDTO[]) {
    // 写入
    await this.handleData(data);
  }

  async getDataList(query: pageProps) {
    // 查询数据逻辑
    console.log(query);
  }

  async handleData(data: LogDTO[]) {
    let monitorData = [];
    const logs = await this.redisService.get('monitor-log');
    if (logs) {
      monitorData = [...data, ...logs];
      await this.redisService.del('monitor-log');
    } else {
      monitorData = [...data];
    }
    await this.redisService.set('monitor-log', monitorData, 86400); // 存储 24 小时
    return { success: true };
  }
}
