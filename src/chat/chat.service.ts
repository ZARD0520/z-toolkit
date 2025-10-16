import { Injectable } from '@nestjs/common';
import { RolePreset, rolePresetMap } from './role-presets';
import { ChatServiceName, ModelType, ReqChatParamsType } from './chat.type';
import { sealGptMessage } from './model/gpt';
import { sealSparkMessage, parseChunk as parseSparkChunk } from './model/spark';
import { AI_MODELS, MODEL_MAP } from '../constants/chat';

@Injectable()
export class ChatService {
  private defaultModel: ModelType = MODEL_MAP[AI_MODELS.SPARK_LITE];
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
  sealMessage(params: ReqChatParamsType, isStream = false) {
    const handlers: Record<ModelType, ChatServiceName> = {
      gpt: 'sealGptMessage',
      sparkLite: 'sealSparkMessage',
    };
    if (params.model && MODEL_MAP[params.model]) {
      this.setModel(MODEL_MAP[params.model]);
    }
    if (params.role && rolePresetMap[params.role]) {
      this.setRolePreset(params.role);
    }
    return this[handlers[this.model]](params.content, {
      isStream,
      rolePreset: this.rolePreset,
    });
  }
  parseChunk(chunk: any) {
    if (this.model === 'sparkLite') {
      return parseSparkChunk(chunk);
    }
  }
}
