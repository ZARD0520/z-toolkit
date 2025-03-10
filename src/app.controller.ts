import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { testPipe } from './core/pipe/test.pipe';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test/:params')
  testPipe(@Query('a', testPipe) a: string, @Param('b', testPipe) b: number) {
    return a + b;
  }
}
