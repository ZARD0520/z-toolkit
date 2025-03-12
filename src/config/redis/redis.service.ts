import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value));
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async get(key: string): Promise<Array<any> | null> {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
