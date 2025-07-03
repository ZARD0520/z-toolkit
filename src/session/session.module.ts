// src/session/session.module.ts
import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { RedisModule } from '../config/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [SessionService],
  exports: [SessionService], // 导出服务
})
export class SessionModule {}
