import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RolePreset, rolePresetMap } from './role-presets';
import {
  ChatInfo,
  ChatServiceName,
  modelConfigType,
  ModelType,
} from './chat.type';

const getChatInfo = (model: string) => {
  if (model === 'spark') {
    return {
      url: 'https://spark-api-open.xf-yun.com/v1/chat/completions',
      // appId: process.env.XF_APP_ID,
      // appSecret: process.env.XF_APP_SECRET,
      // appKey: process.env.XF_APP_KEY,
      appId: 'a2e05f02',
      appSecret: 'NzRkNjM4NzE3ZDQ3Njc2ZWI0NzZmM2U4',
      appKey: 'f1b4e3c0f41c6344b3d9ae997cd5a895',
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
  private modelConfig: modelConfigType;
  private rolePreset: string = rolePresetMap.cat;

  setRolePreset(role: RolePreset) {
    this.rolePreset = rolePresetMap[role];
  }
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
  setModelConfig(chatInfo: ChatInfo, isStream = false) {
    if (this.model === 'spark') {
      this.modelConfig = {
        headers: {
          Authorization: `Bearer ${chatInfo.appKey}:${chatInfo.appSecret}`,
        },
        data: {
          model: 'generalv3.5',
          messages: [
            {
              role: 'system',
              content: this.rolePreset,
            },
          ],
          stream: isStream,
        },
      };
    }
  }

  // 发起请求获取大模型回应
  async getResponse(text: string) {
    if (this.chatInfo === null) {
      return;
    }

    try {
      if (!this.modelConfig) {
        this.setModelConfig(this.chatInfo);
      }
      const { headers, data } = this.modelConfig;
      data.messages.push({
        role: 'user',
        content: text,
      });
      const {
        data: {
          code,
          message,
          choices,
          // usage
        },
      } = await axios.post(this.chatInfo.url, data, {
        headers,
      });

      // 处理并返回最新一条消息
      return code === 0
        ? choices?.[0]?.message?.content ??
            `辣鸡微信出错啦，错误信息：${message}`
        : `辣鸡微信出错啦，错误信息：${message}`;
    } catch (e) {
      // console.error(e);
      return `辣鸡微信出错啦，错误信息：${e.message ?? e}`;
    }
  }
}
