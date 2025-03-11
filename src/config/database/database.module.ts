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
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/../../**/**/*.entity{.ts,.js}'], // 实体文件路径
        synchronize: configService.get<boolean>('database.synchronize'),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.uri'), // 从配置中获取连接字符串
        useNewUrlParser: configService.get<boolean>('mongo.useNewUrlParser'),
        useUnifiedTopology: configService.get<boolean>(
          'mongo.useUnifiedTopology',
        ),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
