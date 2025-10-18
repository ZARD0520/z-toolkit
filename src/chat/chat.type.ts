import { AI_MODELS, AI_ROLE } from '../constants/chat';

export type ModelType = 'gpt' | 'sparkLite' | 'glm';
export type ChatServiceName =
  | 'sealGptMessage'
  | 'sealSparkMessage'
  | 'sealGlmMessage';
export type ChatInfo = {
  url: string;
  appKey: string | undefined;
  model: string;
  appId?: string | undefined;
  appSecret?: string | undefined;
  appPassword?: string | undefined;
};
export type modelConfigType = {
  headers: object;
  data: {
    model: string;
    messages: Array<object>;
    stream: boolean;
  };
};
export type modelConfigParamsType = {
  isStream: boolean;
  rolePreset: string;
};
export type ReqChatParamsType = {
  content: string;
  model?: AI_MODELS;
  role?: AI_ROLE;
};
