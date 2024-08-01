import { Controller, Get, Header, HttpCode, Post, Query } from '@nestjs/common';
import { XML } from '../xml/xml.decorator';
import { WxService } from './wx.service';
import { ChatService } from 'src/chat/chat.service';

interface WxValidQuery {
  signature: string;
  timestamp: string;
  echostr: string;
  nonce: string;
  msg_signature?: string;
}

@Controller('wx')
export class WxController {
  constructor(
    private readonly wxService: WxService,
    private readonly chatService: ChatService,
  ) {}

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
    const message = this.wxService.handleMessage(Encrypt);
    return this.wxService.generateResponse(message, nonce);
    // switch (message.MsgType) {
    //   case 'text':
    //     if (message.Content === '[收到不支持的消息类型，暂无法显示]') {
    //       const text =
    //         '身为高贵的智能体，我才不会试图看懂这些奇奇怪怪的东西。你们人类真是难以理解生物呢';
    //       return generateFastResponse(text);
    //     }
    //     const response = this.wxService.generateResponse(message, nonce);
    //     return response;
    //   case 'image':
    //     // const { PicUrl } = message
    //     return generateFastResponse('收到图片啦，听我说谢谢你');
    //   case 'voice':
    //     // const { Format, Recognition, MediaId } = message
    //     return generateFastResponse('人家听不清啦，才不是听不懂~');
    //   case 'video':
    //     return generateFastResponse(
    //       '想约我看小视频呢？听我说谢谢你，不过人家可没这个兴趣哦！',
    //     );
    //   case 'location':
    //     return generateFastResponse(`
    //       这里不是${message.Label}嘛？附近大概有什么好玩的，可惜人家超级宅哦，根本不想出门
    //     `);
    //   case 'file':
    //     const {
    //       Title,
    //       // Description,
    //       // FileKey,
    //       // FileMd5,
    //       // FileTotalLen
    //     } = message;
    //     return generateFastResponse(
    //       `嗯？这个文件是${Title}？我不晓得是干撒子用的嘞，我只想当个高贵的不用动脑子的AI！请不要给琥珀出这种难题啦！`,
    //     );
    //   case 'event':
    //     const text =
    //       '嗨，我是琥珀，我会简单的聊天哦！谢谢你这么可爱还关注我，接下来的日子里希望我们都能快快乐乐，一起向前';
    //     return generateFastResponse(text);
    //   default:
    //     return generateFastResponse('你这发了个撒子东西哦，完全认不出来');
    // }
  }

  @Get('msg')
  async handleMsg() {
    const message = '你知道黄俊杰吗';
    const response = await this.chatService.sealMessage(message);
    await this.wxService.getAccessToken();
    return response;
  }

  @Get('material')
  async handleMaterial() {
    const token = await this.wxService.getAccessToken();
    if (!token) {
      return null;
    }
    const result = await this.wxService.getMaterialList(token, {
      type: 'image',
      offset: 0,
      count: 1,
    });
    return result;
  }

  // 后续改成post，menu由参数传入
  @Get('createMenu')
  async createMenu() {
    const token = await this.wxService.getAccessToken();
    if (!token) {
      return null;
    }
    const menu = {
      button: [
        {
          type: 'click',
          name: '今日歌曲',
          key: 'V1001_TODAY_MUSIC',
        },
        {
          name: '菜单',
          sub_button: [
            {
              type: 'view',
              name: '搜索',
              url: 'http://www.soso.com/',
            },
            {
              type: 'miniprogram',
              name: 'wxa',
              url: 'http://mp.weixin.qq.com',
              appid: 'wx286b93c14bbf93aa',
              pagepath: 'pages/lunar/index',
            },
            {
              type: 'click',
              name: '赞一下我们',
              key: 'V1001_GOOD',
            },
          ],
        },
      ],
    };
    const result = await this.wxService.createMenu(token, menu);
    return result;
  }

  @Get('getMenu')
  async getMenu() {
    const token = await this.wxService.getAccessToken();
    if (!token) {
      return null;
    }
    const result = await this.wxService.getMenu(token);
    return result;
  }
}
