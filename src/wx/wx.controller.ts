import { Controller, Get, Header, HttpCode, Post, Query } from '@nestjs/common';
import { XML } from '../xml/xml.decorator';
import { WxService } from './wx.service';

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
  @Header('Content-Type', 'application/xml')
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

    // console.log(xml);
    const message = this.wxService.handleMessage(Encrypt);
    const response = this.wxService.generateResponse(message, nonce);
    return response;

    // const result = this.wxService.handleMessage(decrypted);
    // const encrypt = this.wxService.encryptMessage(result);

    // console.log(result, query);
    // console.log('收到消息：', Content);

    // const response = await this.wxService.generateResponse(nonce, encrypt);
    // return response;

    // const response = `<xml>
    //   <Encrypt><![CDATA[${encrypted}]]></Encrypt>
    //   <MsgSignature><![CDATA[${this.wxService.generateSignature(result)}]]></MsgSignature>
    //   <TimeStamp>${Date.now()}</TimeStamp>
    //   <Nonce><![CDATA[${this.wxService.generateNonce()}]]></Nonce>
    // </xml>`;

    // return response;
  }

  @Get('msg')
  handleMsg() {
    const message = '你知道黄俊杰吗';
    const response = this.wxService.generateResponseText(message);
    return response;
  }
}
