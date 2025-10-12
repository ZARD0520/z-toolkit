import { Injectable } from '@nestjs/common';
import { RolePreset, rolePresetMap } from './role-presets';
import { ChatServiceName, ModelType } from './chat.type';
import { sealGptMessage } from './model/gpt';
import { sealSparkMessage, parseChunk as parseSparkChunk } from './model/spark';

@Injectable()
export class ChatService {
  private defaultModel: ModelType = 'spark';
  private model = this.defaultModel;
  // 大模型的相关信息
  private rolePreset: string = rolePresetMap.programmer;

  // 大模型发送消息
  private sealGptMessage = sealGptMessage;
  private sealSparkMessage = sealSparkMessage;

  setRolePreset(role: RolePreset) {
    this.rolePreset = rolePresetMap[role];
  }
  setModel(model: ModelType) {
    this.model = model;
  }
  sealMessage(
    text: string,
    isStream = false,
    model: ModelType = this.defaultModel,
  ) {
    const handlers: Record<ModelType, ChatServiceName> = {
      gpt: 'sealGptMessage',
      spark: 'sealSparkMessage',
    };
    return this[handlers[model]](text, {
      isStream,
      rolePreset: this.rolePreset,
    });
  }
  parseChunk(chunk: any) {
    if (this.model === 'spark') {
      return parseSparkChunk(chunk);
    }
  }
}
