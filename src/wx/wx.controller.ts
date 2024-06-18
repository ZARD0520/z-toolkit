import { Controller, Get, Query } from '@nestjs/common';
import { WxService } from './wx.service';
// import sha1 from 'sha1';
import sha1 from 'sha1-plus';
// const sha1 = require('sha1');

interface WxValidQuery {
  signature: string;
  timestamp: string;
  echostr: string;
  nonce: string;
}

@Controller('wx')
export class WxController {
  constructor(private readonly wxService: WxService) {}

  @Get()
  getWx(@Query() query: WxValidQuery): string {
    const token = 'z-tooltik';
    const signature = query.signature;
    const timestamp = query.timestamp;
    const echostr = query.echostr;
    const nonce = query.nonce;

    const oriArray = [nonce, timestamp, token];

    oriArray.sort();

    const original = oriArray.join('');
    const sha = sha1(original);

    if (signature === sha) {
      //验证成功
      return echostr;
    } else {
      //验证失败
      return 'Invalid';
    }
    // return this.wxService.getHello();
  }
}
