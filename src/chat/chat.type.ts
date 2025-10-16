import { AI_MODELS } from 'src/constants/chat';

export type ModelType = 'gpt' | 'sparkLite';
export type ChatServiceName = 'sealGptMessage' | 'sealSparkMessage';
export type ChatInfo = {
  url: string;
  appId: string | undefined;
  appSecret: string | undefined;
  appKey: string | undefined;
  appPassword: string | undefined;
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
  role?: string;
};
