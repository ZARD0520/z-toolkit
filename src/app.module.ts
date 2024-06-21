import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database.module';
import { WxController } from './wx/wx.controller';
import { WxService } from './wx/wx.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController, WxController, ChatController],
  providers: [AppService, WxService, ChatService],
  // middlewares: [XMLMiddleware]
})
export class AppModule {}
