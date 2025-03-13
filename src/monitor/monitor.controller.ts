import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { AddLogProps } from './monitor.type';
import { pageProps } from 'src/types/page';
import { SessionService } from 'src/session/session.service';

// 注入一个token校验的guard
@Controller('monitor')
export class MonitorController {
  constructor(
    private readonly monitorService: MonitorService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('/add')
  async add(@Body() reqData: AddLogProps) {
    const isValid = await this.sessionService.validateSessionId(
      reqData.sessionId,
    );
    if (!isValid) {
      throw new HttpException('Invalid Session ID', HttpStatus.FORBIDDEN);
    }
    const result = await this.monitorService.addData(
      reqData.data,
      reqData.sessionId,
      reqData.platform,
    );
    return result;
  }

  @Get('/list')
  async list(@Query() query: pageProps) {
    const result = await this.monitorService.getDataList(query);
    return result;
  }
}
