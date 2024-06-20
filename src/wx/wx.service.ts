import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createDecipheriv, createHash } from 'crypto';
import { stringify } from 'qs';
import sha1 from 'sha1-plus';

const WX_APP_ID = 'wx52f22f40aeb34ad1';
const WX_APP_SECRET = 'dacc89cdc914278d29acdd38495dcae4';
const WX_TOKEN = 'onlyy';
const ENCODING_AES_KEY = 'hqyQiFMucKq9p0S0CZBFZ8Dq0vkOatkWU2LLWW1Uthg';

function decrypt(text: string, password: string) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = createDecipheriv(
    'aes-256-cbc',
    createHash('sha256').update(password).digest(),
    iv,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

@Injectable()
export class WxService {
  private token = WX_TOKEN;
  private AESKey = atob(ENCODING_AES_KEY + '=');
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

    oriArray.sort();

    const original = oriArray.join('');
    const sha = sha1(original);

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
  // 解密
  decryptMessage(encodedMsg: string) {
    const tmpMsg = atob(encodedMsg);
    const res = decrypt(tmpMsg, this.AESKey);

    console.log(res);
    return encodedMsg;
  }
  handleMessage(msg: string) {
    return msg;
  }
  encryptMessage(msg: string) {
    return msg;
  }
  generateSignature(str: string) {
    return str;
  }
  generateNonce() {
    return 'nonce-test';
  }
}
