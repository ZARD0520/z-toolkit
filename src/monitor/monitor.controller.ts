import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { AddLogProps } from './monitor.type';
import { pageProps } from 'src/core/type/page';

// 注入一个token校验的guard
@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Post('/add')
  async add(@Body() reqData: AddLogProps) {
    const result = await this.monitorService.addData(reqData.data);
    return result;
  }

  @Get('/list')
  async list(@Query() query: pageProps) {
    const result = await this.monitorService.getDataList(query);
    return result;
  }
}
