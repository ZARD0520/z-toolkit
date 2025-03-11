import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.redis_host || 'localhost', // Redis 服务器地址
  port:
    (process.env.redis_port && parseInt(process.env.redis_port, 10)) || 6379, // Redis 端口
  password: process.env.redis_password || '', // Redis 密码（可选）
}));
