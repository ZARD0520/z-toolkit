import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}

  async set(key: string, value: any, ttl?: number): Promise<'OK'> {
    const res = await this.redisClient.set(key, JSON.stringify(value));
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
    return res;
  }

  async get(key: string): Promise<any | null> {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  async lpush(key: string, ...values: any[]): Promise<number> {
    return this.redisClient.lpush(key, ...values);
  }

  async rpush(key: string, ...values: any[]): Promise<number> {
    return this.redisClient.rpush(key, ...values);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redisClient.lrange(key, start, stop);
  }

  async rename(srcKey: string, destKey: string): Promise<boolean> {
    try {
      await this.redisClient.rename(srcKey, destKey);
      return true;
    } catch (err) {
      if (err.message.includes('no such key')) {
        return false;
      }
      throw err;
    }
  }

  async expire(key: string, ttl: number): Promise<number> {
    return this.redisClient.expire(key, ttl);
  }

  async llen(key: string) {
    return this.redisClient.llen(key);
  }
}
