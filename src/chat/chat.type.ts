export type ModelType = 'gpt' | 'spark';
export type ChatServiceName = 'sealGptMessage' | 'sealSparkMessage';
export type ChatInfo = {
  url: string;
  appId: string | undefined;
  appSecret: string | undefined;
  appKey: string | undefined;
};
export type modelConfigType = {
  headers: object;
  data: {
    model: string;
    messages: Array<object>;
    stream: boolean;
  };
};
