import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '../config/redis/redis.service';
import { MonitorEvents } from '../monitor/entities/MonitorEvents.entity';

@Injectable()
export class LogTaskService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(MonitorEvents)
    private readonly logRepository: Repository<MonitorEvents>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const logs = await this.redisService.get('monitor-log');
    if (logs) {
      for (const message of logs) {
        const log = this.logRepository.create({ message });
        await this.logRepository.save(log); // 将日志存入数据库
      }
      await this.redisService.del('monitor-log');
    }
  }
}
