import { Injectable } from '@nestjs/common';
import { LogDTO } from './monitor.type';
import { pageProps } from 'src/core/type/page';
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
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const key = `log:${item.userId || 'anonymous'}:${item.time || Date.now()}`;
      await this.redisService.set(key, item, 86400); // 存储 24 小时
    }
    return { success: true };
  }
}
