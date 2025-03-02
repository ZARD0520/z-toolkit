import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database.module';
import { WxController } from './wx/wx.controller';
import { WxService } from './wx/wx.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { MonitorController } from './monitor/monitor.controller';
import { MonitorService } from './monitor/monitor.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController, WxController, ChatController, MonitorController],
  providers: [AppService, WxService, ChatService, MonitorService],
  // middlewares: [XMLMiddleware]
})
export class AppModule {}
