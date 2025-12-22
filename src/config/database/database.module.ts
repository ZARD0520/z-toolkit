import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mysqlConfig from './mysql.config';
import mongodbConfig from './mongodb.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mysqlConfig, mongodbConfig],
      envFilePath:
        '.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.database'),
          entities: [__dirname + '/../../**/**/*.entity{.ts,.js}'], // 实体文件路径
          synchronize: configService.get<boolean>('database.synchronize'),
          poolSize: 10,
        };
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri =
          configService.get<string>('mongo.uri') ||
          'mongodb://localhost:27017/wezard';
        const username = configService.get<string>('mongo.username');
        const password = configService.get<string>('mongo.password');

        // 构建带认证的连接字符串
        let authUri = uri;
        if (username && password) {
          try {
            const url = new URL(uri);
            // 对用户名和密码进行 URL 编码，防止特殊字符导致连接失败
            url.username = encodeURIComponent(username);
            url.password = encodeURIComponent(password);
            // 添加 authSource=admin，因为 root 用户默认在 admin 数据库中
            url.searchParams.set('authSource', 'admin');
            authUri = url.toString();
          } catch (error) {
            // 如果URL解析失败，使用原始URI
            authUri = uri;
          }
        }

        return {
          uri: authUri,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
