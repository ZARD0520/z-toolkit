import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  uri: process.env.mongo_uri || 'mongodb://localhost/nest', // 默认连接字符串
  useNewUrlParser: true,
  useUnifiedTopology: true,
}));
