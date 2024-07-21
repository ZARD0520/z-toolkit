import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  pseudoRandomBytes,
} from 'crypto';
import { XMLParser } from 'fast-xml-parser';
import { stringify } from 'qs';

interface WxMessage {
  FromUserName: string;
  ToUserName: string;
  MsgType: MessageType;
  MsgId: string;
  Content?: string;
  MediaId?: string;
  PicUrl?: string;
  Format?: string; // voice的格式
  Recognition?: string;
}

interface TextMessage {
  text: string;
}

interface BaseMediaMessage {
  media_id: string;
}

interface ImageMessage extends BaseMediaMessage {}

interface VoiceMessage extends BaseMediaMessage {}

interface VedioMessage extends BaseMediaMessage {
  title: string;
  description: string;
}

interface MusicMessage extends VedioMessage {
  music_url: string;
  hq_music_url: string;
}

interface ArticalType {
  title: string;
  description: string;
  pic_url: string;
  url: string;
}
interface NewsMessage {
  artical_count: number | string;
  articals: ArticalType[];
}

// type MessageContentType =
//     TextMessage
//   | ImageMessage
//   | VoiceMessage
//   | VedioMessage
//   | MusicMessage
//   | NewsMessage

interface MessageContentType {
  text: TextMessage;
  image: ImageMessage;
  voice: VoiceMessage;
  vedio: VedioMessage;
  music: MusicMessage;
  news: NewsMessage;
}

type MessageType = keyof MessageContentType;

interface ResponseMsgParams {
  type?: MessageType;
  content: MessageContentType[MessageType];
  nonce: string;
  timestamp: string;
  from: string;
  to: string;
}

const WX_APP_ID = 'wx52f22f40aeb34ad1';
const WX_APP_SECRET = 'dacc89cdc914278d29acdd38495dcae4';
const WX_TOKEN = 'onlyy';
const ENCODING_AES_KEY = 'hqyQiFMucKq9p0S0CZBFZ8Dq0vkOatkWU2LLWW1Uthg';

const config = {
  wechatMessageEncryptMode: '1',
};

@Injectable()
export class WxService {
  private appId = WX_APP_ID;
  private token = WX_TOKEN;
  private AESKey = Buffer.from(ENCODING_AES_KEY + '=', 'base64');
  private iv = this.AESKey.slice(0, 16);

  private accessToken = '';
  private accessTokenLastModified = -1;
  // 校验请求是否来自微信服务器
  validate(
    timestamp: string,
    nonce: string,
    signature: string,
    encrypt?: string,
  ): boolean {
    const oriArray = [nonce, timestamp, this.token];
    encrypt && oriArray.push(encrypt);

    const sha = this.generateSignature(...oriArray);

    return signature === sha;
  }
  // 获取access_token
  async getAccessToken() {
    const shouldUpdate =
      Date.now() - this.accessTokenLastModified > 1.9 * 60 * 60 * 1000; // 2h有效期; 取1.9小时，预留 0.1 h的容错时间
    if (!shouldUpdate) return this.accessToken;
    const params = stringify({
      grant_type: 'client_credential',
      appid: WX_APP_ID,
      secret: WX_APP_SECRET,
    });
    const res = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?${params}`,
    );
    console.log(params);
    console.log(res.data);

    return this.accessToken;
  }
  // 获取素材列表
  async getMaterialList(
    token: string,
    data: { type: string; offset: number; count: number },
  ) {
    const params = stringify({
      access_token: token,
    });
    const res = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/material/batchget_material?${params}`,
      data,
    );
    return res;
  }

  /**
   * 对密文进行解密
   * @param {String} encodedMsg    待解密的密文
   */
  decryptMsg(encodedMsg: string) {
    // 创建解密对象，AES采用CBC模式，数据采用PKCS#7填充；IV初始向量大小为16字节，取AESKey前16字节
    const decipher = createDecipheriv('aes-256-cbc', this.AESKey, this.iv);
    decipher.setAutoPadding(false);

    let deciphered = Buffer.concat([
      decipher.update(encodedMsg, 'base64'),
      decipher.final(),
    ]);

    deciphered = this.decode(deciphered);
    // 算法：AES_Encrypt[random(16B) + msg_len(4B) + msg + $CorpID]
    // 去除16位随机数
    const content = deciphered.slice(16);
    const length = content.slice(0, 4).readUInt32BE(0);

    return {
      message: content.slice(4, length + 4).toString(),
      appId: content.slice(length + 4).toString(),
    };
  }
  /**
   * 对明文进行加密
   * 算法：Base64_Encode(AES_Encrypt[random(16B) + msg_len(4B) + msg + $appId])
   * @param {String} text    待加密明文文本
   */
  encryptMsg(text: string) {
    // 16B 随机字符串
    const randomString = pseudoRandomBytes(16);

    const msg = Buffer.from(text);
    // 获取4B的内容长度的网络字节序
    const msgLength = Buffer.alloc(4);
    msgLength.writeUInt32BE(msg.length, 0);

    const id = Buffer.from(this.appId);

    const bufMsg = Buffer.concat([randomString, msgLength, msg, id]);

    // 对明文进行补位操作
    const encoded = this.encode(bufMsg);

    // 创建加密对象，AES采用CBC模式，数据采用PKCS#7填充；IV初始向量大小为16字节，取AESKey前16字节
    const cipher = createCipheriv('aes-256-cbc', this.AESKey, this.iv);
    cipher.setAutoPadding(false);

    const cipheredMsg = Buffer.concat([cipher.update(encoded), cipher.final()]);

    return cipheredMsg.toString('base64');
  }
  handleMessage(Encrypt: string) {
    const xmlSource = this.decryptMsg(Encrypt);
    const xmlParser = new XMLParser();
    const { xml } = xmlParser.parse(xmlSource.message);
    return xml;
  }
  generateSignature(...args: string[]) {
    args.sort();
    const original = args.join('');

    const sha = createHash('sha1');
    sha.update(original);
    return sha.digest('hex');
  }
  generateNonce() {
    return 'nonce-test';
  }

  async generateTextMessageContent(message: WxMessage): Promise<TextMessage> {
    const responseText = await this.generateResponseText(message.Content!);
    return {
      text: responseText,
    };
  }
  async generateImageMessageContent(message: WxMessage): Promise<ImageMessage> {
    console.log('message:\n', message);

    return {
      media_id: message.MediaId!,
    };
  }
  async generateVoiceMessageContent(message: WxMessage): Promise<VoiceMessage> {
    console.log('message:\n', message);

    return {
      media_id: message.MediaId!,
    };
  }
  async generateVedioMessageContent(message: WxMessage): Promise<VedioMessage> {
    console.log('message:\n', message);

    return {
      media_id: 'aaa',
      title: '娃哈哈',
      description: 'whh',
    };
  }
  async generateMusicMessageContent(message: WxMessage): Promise<MusicMessage> {
    console.log('message:\n', message);

    return {
      media_id: 'aaa',
      title: '唱歌',
      description: 'music',
      music_url: '',
      hq_music_url: '',
    };
  }
  async generateNewsMessageContent(message: WxMessage): Promise<NewsMessage> {
    console.log('message:\n', message);

    return {
      artical_count: 2,
      articals: [
        {
          title: '第一个',
          description: 'no1',
          pic_url: '',
          url: '',
        },
        {
          title: '第二个',
          description: 'no2',
          pic_url: '',
          url: '',
        },
      ],
    };
  }
  async generateResponse(message: WxMessage, nonce: string): Promise<string> {
    // ts报错？！
    // const handlers: Record<MessageType, Partial<keyof WxService>> = {
    //   text: 'generateTextMessageContent',
    //   image: 'generateImageMessageContent',
    //   voice: 'generateVoiceMessageContent',
    //   vedio: 'generateVedioMessageContent',
    //   music: 'generateMusicMessageContent',
    //   news: 'generateNewsMessageContent'
    // }
    // const content = await this[handlers.text](message)
    // console.log('res-text:', content, message)

    let content: MessageContentType[MessageType];
    switch (message.MsgType) {
      case 'text':
        content = await this.generateTextMessageContent(message);
        break;
      case 'image':
        content = await this.generateImageMessageContent(message);
        break;
      case 'voice':
        content = await this.generateVoiceMessageContent(message);
        break;
      case 'vedio':
        content = await this.generateVedioMessageContent(message);
        break;
      case 'music':
        content = await this.generateMusicMessageContent(message);
        break;
      case 'news':
        content = await this.generateNewsMessageContent(message);
        break;
      default:
        content = await this.generateTextMessageContent(message);
    }

    const timestamp = Date.now().toString();
    return this.sealResponseMsg({
      type: message.MsgType,
      content,
      nonce,
      timestamp,
      from: message.FromUserName,
      to: message.ToUserName,
    });
  }
  // 处理消息，调用AI接口获取回复内容并返回回复内容中的字符串
  async generateResponseText(text: string) {
    try {
      const { data } = await axios.post('/api/chat/once', { content: text });
      return data.data;
    } catch (e) {
      return e.code;
    }
  }

  sealResponseMsg({
    type = 'text',
    content,
    nonce,
    timestamp,
    from,
    to,
  }: ResponseMsgParams) {
    const msgTypeTamplate = '<MsgType><![CDATA[text]]></MsgType>';
    const xmlMsgType = msgTypeTamplate.replace('text', type);
    const xmlContent = this.generateContent(type, content);
    const xmlResponse = `<xml>
          <ToUserName><![CDATA[${from}]]></ToUserName>
          <FromUserName><![CDATA[${to}]]></FromUserName>
          <CreateTime>${timestamp}</CreateTime>
          ${xmlMsgType}
          ${xmlContent}
        </xml>`;

    if (config.wechatMessageEncryptMode === '2') {
      const encryptData = this.encryptMsg(xmlResponse);
      // console.log('encryptData', encryptData)
      const msgSignature = this.generateSignature(
        timestamp,
        nonce,
        encryptData,
      );
      const result = `<xml>
          <Encrypt><![CDATA[${encryptData}]]></Encrypt>
          <MsgSignature>${msgSignature}</MsgSignature>
          <TimeStamp>${timestamp}</TimeStamp>
          <Nonce>${nonce}</Nonce>
        </xml>`;

      // console.log(content, result);
      return result;
    }

    return xmlResponse;
  }
  generateContent(type: MessageType, content: MessageContentType[typeof type]) {
    switch (type) {
      case 'text':
        const { text } = <TextMessage>content;
        return `<Content><![CDATA[${text}]]></Content>`;
      case 'image': {
        const { media_id } = <ImageMessage>content;
        return `
          <Image>
            <MediaId><![CDATA[${media_id}]]></MediaId>
          </Image>
        `;
      }
      case 'voice': {
        const { media_id } = <VoiceMessage>content;
        return `
          <Voice>
            <MediaId><![CDATA[${media_id}]]></MediaId>
          </Voice>
        `;
      }
      case 'vedio': {
        const { media_id, title, description } = <VedioMessage>content;
        return `
          <Video>
            <MediaId><![CDATA[${media_id}]]></MediaId>
            <Title><![CDATA[${title}]]></Title>
            <Description><![CDATA[${description}]]></Description>
          </Video>
        `;
      }
      case 'music': {
        const { media_id, title, description, music_url, hq_music_url } = <
          MusicMessage
        >content;
        return `
          <Music>
            <Title><![CDATA[${title}]]></Title>
            <Description><![CDATA[${description}]]></Description>
            <MusicUrl><![CDATA[${music_url}]]></MusicUrl>
            <HQMusicUrl><![CDATA[${hq_music_url}]]></HQMusicUrl>
            <ThumbMediaId><![CDATA[${media_id}]]></ThumbMediaId>
          </Music>
        `;
      }
      case 'news': {
        const { artical_count, articals } = <NewsMessage>content;
        return `
          <ArticleCount>${artical_count}</ArticleCount>
          <Articles>
            ${articals.map(
              ({ title, description, pic_url, url }) => `
                <item>
                  <Title><![CDATA[${title}]]></Title>
                  <Description><![CDATA[${description}]]></Description>
                  <PicUrl><![CDATA[${pic_url}]]></PicUrl>
                  <Url><![CDATA[${url}]]></Url>
                </item>
              `,
            )}
          </Articles>
        `;
      }
    }
  }
  /**
   * 删除补位
   * @param {Buffer} text 解密后的明文
   */
  decode(text: Buffer) {
    let pad = Number(text[text.length - 1]);
    if (pad < 1 || pad > 32) {
      pad = 0;
    }
    return text.slice(0, text.length - pad);
  }
  /**
   * 填充补位
   * @param {Buffer} text 需要进行填充补位的明文
   */
  encode(text: Buffer) {
    const blockSize = 32;
    const textLength = text.length;
    // 计算需要填充的位数
    const amountToPad = blockSize - (textLength % blockSize);
    const result = Buffer.alloc(amountToPad);
    result.fill(amountToPad);
    return Buffer.concat([Buffer.from(text), result]);
  }
}
