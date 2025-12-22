import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  uri: process.env.MONGO_URI || 'mongodb://mongo-container/nest', // 默认连接字符串
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
}));
