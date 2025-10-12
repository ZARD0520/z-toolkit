import { modelConfigParamsType } from '../chat.type';

export const sealGptMessage = (text: string, config: modelConfigParamsType) => {
  console.log(config);
  return text;
};
