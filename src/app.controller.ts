import {
  Controller,
  Get,
  HttpStatus,
  // Inject,
  Param,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { testPipe } from './core/pipe/test.pipe';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
// import { ClientProxy } from '@nestjs/microservices';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Inject('xx_SERVICE')
  // private xxClient: ClientProxy;

  // @Get()
  // getHello(): string {
  //   // 调用微服务模块的方法
  //   // 微服务模块用@MessagePattern声明的方法，调用时用send，有返回值
  //   // @EventPattern声明的方法，调用时用emit，无返回值
  //   this.xxClient.send('xxx', 'xxx');
  //   return this.appService.getHello();
  // }

  /* 可以利用ApiTag进行分组 */
  @ApiOperation({ summary: '测试 aaa', description: 'aaa 描述' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'aaa 成功',
    type: String,
  })
  /* 根据不同的参数类型，api不同 */
  /* ApiBody的type可以传Dto、Vo对象，定义这些对象时，又可以用ApiProperty定义属性 */
  @ApiQuery({
    name: 'a',
    type: String,
    description: 'a param',
    required: false,
    example: '1111',
  })
  @ApiQuery({
    name: 'b',
    type: Number,
    description: 'b param',
    required: true,
    example: 2222,
  })
  @Get('test/:params')
  testPipe(@Query('a', testPipe) a: string, @Param('b', testPipe) b: number) {
    return a + b;
  }
}
