import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';
import redisConfig from './redis.config';
import { redisProvider } from './redis.providers';

@Module({
  imports: [ConfigModule.forFeature(redisConfig)], // 加载 Redis 配置
  providers: [redisProvider, RedisService],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
