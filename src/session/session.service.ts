import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/config/redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SessionService {
  private readonly redisService: RedisService;

  generateSessionId(): string {
    return uuidv4();
  }

  async storeSessionId(sessionId: string): Promise<void> {
    await this.redisService.set(sessionId, 'active', 1800); // 设置 30 分钟有效期
  }

  async validateSessionId(sessionId: string): Promise<boolean> {
    const result = await this.redisService.exists(sessionId);
    return result;
  }
}
