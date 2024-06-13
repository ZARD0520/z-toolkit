import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '')
    }),
  ],
})
export class DatabaseModule { }