import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { RedisModule } from './config/redis/redis.module';
import { WxController } from './wx/wx.controller';
import { WxService } from './wx/wx.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { MonitorController } from './monitor/monitor.controller';
import { MonitorService } from './monitor/monitor.service';
import { TestMiddleware } from './core/middleware/test.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitorEventsSchema } from './monitor/schema/MonitorEvents.schema';
import { MonitorSessionSchema } from './monitor/schema/MonitorSession.schema';
import { MonitorUserSchema } from './monitor/schema/MonitorUser.schema';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLogInterceptor } from './core/interceptor/requestLog/requestLog.interceptor';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { SessionModule } from './session/session.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // ClientsModule.register([
    //   /* 微服务注册，使用时，像普通service一样直接注入，然后调用即可 */
    //   {
    //     name: 'xx_SERVICE',
    //     transport: Transport.TCP,
    //     options: {
    //       port: 8888,
    //     },
    //   },
    // ]),
    ScheduleModule.forRoot(),
    SessionModule,
    DatabaseModule,
    RedisModule,
    MongooseModule.forFeature([
      { name: 'MonitorEvents', schema: MonitorEventsSchema },
      { name: 'MonitorSession', schema: MonitorSessionSchema },
      { name: 'MonitorUser', schema: MonitorUserSchema },
    ]),
    UserModule,
    EmailModule,
  ],
  controllers: [AppController, WxController, ChatController, MonitorController],
  providers: [
    AppService,
    WxService,
    ChatService,
    MonitorService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLogInterceptor,
    },
  ],
  // middlewares: [XMLMiddleware]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TestMiddleware)
      .forRoutes({ path: 'hello*', method: RequestMethod.GET });
  }
}
