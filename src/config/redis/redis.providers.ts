import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const redisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    const password = configService.get<string>('redis.password');
    const config: any = {
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
    };
    // 只有当密码存在且不为空时才添加密码选项
    if (password && password.trim() !== '') {
      config.password = password;
    }
    return new Redis(config);
  },
  inject: [ConfigService],
};
