import { Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { WxService } from './wx.service';
// import sha1 from 'sha1';
// const sha1 = require('sha1');
import { XML } from '../xml/xml.decorator';

interface WxValidQuery {
  signature: string;
  timestamp: string;
  echostr: string;
  nonce: string;
  msg_signature?: string;
}

@Controller('wx')
export class WxController {
  constructor(private readonly wxService: WxService) {}

  @Get()
  wxValidate(@Query() query: WxValidQuery): string {
    const signature = query.signature;
    const timestamp = query.timestamp;
    const echostr = query.echostr;
    const nonce = query.nonce;

    // this.wxService.getAccessToken();

    return this.wxService.validate(timestamp, nonce, signature)
      ? echostr
      : 'InValide Server';
  }

  @Post()
  @HttpCode(200)
  async onMessage(@Query() query: WxValidQuery, @XML() xmlPromise: any) {
    // 校验消息是否来自微信服务器
    const xml = await xmlPromise;
    const { Encrypt } = xml;
    const { timestamp, nonce, msg_signature: signature } = query;
    const isFromWxServer = this.wxService.validate(
      timestamp,
      nonce,
      signature!,
      Encrypt,
    );
    if (!isFromWxServer) return '';

    const decrypted = this.wxService.decryptMessage(Encrypt);

    const result = this.wxService.handleMessage(decrypted);
    // const encrypted = this.wxService.encryptMessage(result);

    console.log(result, query);

    // const response = `<xml>
    //   <Encrypt><![CDATA[${encrypted}]]></Encrypt>
    //   <MsgSignature><![CDATA[${this.wxService.generateSignature(result)}]]></MsgSignature>
    //   <TimeStamp>${Date.now()}</TimeStamp>
    //   <Nonce><![CDATA[${this.wxService.generateNonce()}]]></Nonce>
    // </xml>`;

    // return response;
  }
}
