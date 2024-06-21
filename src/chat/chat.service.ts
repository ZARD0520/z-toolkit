import { Injectable } from '@nestjs/common';
type ModelType = 'gpt' | 'spark';
type ChatServiceName = 'sealGptMessage' | 'sealSparkMessage';

enum MODEL_APP_IDS {
  gpt = '',
  spark = '11',
}

enum MODEL_APP_SECRETS {
  gpt = '123',
  spark = '',
}

@Injectable()
export class ChatService {
  private defaultModel: ModelType = 'spark';
  private model = this.defaultModel;
  // 大模型的key和secret
  private modelAppId = MODEL_APP_IDS[this.model];
  private modelAppSecret = MODEL_APP_SECRETS[this.model];

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
    return text;
  }
  // 发起请求获取大模型回应
  getResponse(message: any) {
    // todo: any类型记得换掉
    // axios.post('', message);

    return message;
  }
}
