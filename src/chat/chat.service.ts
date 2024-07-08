import { Injectable } from '@nestjs/common';
import axios from 'axios';

type ModelType = 'gpt' | 'spark';
type ChatServiceName = 'sealGptMessage' | 'sealSparkMessage';
type ChatInfo = {
  url: string;
  appId: string | undefined;
  appSecret: string | undefined;
  appKey: string | undefined;
};

const getChatInfo = (model: string) => {
  if (model === 'spark') {
    return {
      url: 'https://spark-api-open.xf-yun.com/v1/chat/completions',
      appId: process.env.XF_APP_ID,
      appSecret: process.env.XF_APP_SECRET,
      appKey: process.env.XF_APP_KEY,
    };
  }
  return null;
};

@Injectable()
export class ChatService {
  private defaultModel: ModelType = 'spark';
  private model = this.defaultModel;
  // 大模型的相关信息
  private chatInfo = getChatInfo(this.model);

  sealMessage(text: string, model: ModelType = this.defaultModel) {
    const handlers: Record<ModelType, ChatServiceName> = {
      gpt: 'sealGptMessage',
      spark: 'sealSparkMessage',
    };
    return this[handlers[model]](text);
  }
  sealGptMessage(text: string) {
    return text;
  }
  sealSparkMessage(text: string) {
    return this.getResponse(text);
  }

  // 获取大模型配置
  setModelConfig(chatInfo: ChatInfo) {
    return {
      headers: {
        Authorization: `Bearer ${chatInfo.appKey}:${chatInfo.appSecret}`,
      },
      data: {
        model: 'generalv3.5',
        message: [
          {
            role: '猫娘',
            content: '你是哪个',
          },
        ],
        stream: true,
      },
    };
  }

  // 发起请求获取大模型回应
  async getResponse(message: string) {
    if (this.chatInfo === null) {
      return;
    }
    console.log(message);
    try {
      const { headers, data } = this.setModelConfig(this.chatInfo);
      const res = await axios.post(this.chatInfo.url, data, {
        headers,
      });
      return res;
    } catch (e) {
      console.error(e);
    }
  }
}
