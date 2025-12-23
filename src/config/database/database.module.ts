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
        let uri;
        const host = configService.get<string>('mongo.host');
        const port = configService.get<string>('mongo.port') || '27017';
        const username = configService.get<string>('mongo.username');
        const password = configService.get<string>('mongo.password');
        const database = configService.get<string>('mongo.database');

        // 构建带认证的连接字符串
        if (username && password) {
          // 对用户名和密码进行URL编码
          const encodedUsername = encodeURIComponent(username);
          const encodedPassword = encodeURIComponent(password);
          uri = `mongodb://${encodedUsername}:${encodedPassword}@${host}:${port}/${database}?authSource=admin`;
        } else {
          uri = `mongodb://${host}:${port}/${database}`;
        }

        console.log(111111, uri);
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
