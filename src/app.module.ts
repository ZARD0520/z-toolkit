import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database.module';
import { WxController } from './wx/wx.controller';
import { WxService } from './wx/wx.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController, WxController],
  providers: [AppService, WxService],
})
export class AppModule {}
