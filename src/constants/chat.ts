import { ModelType } from '../chat/chat.type';

export enum AI_MODELS {
  SPARK_LITE = '1',
  GPT = '2',
}
export const MODEL_MAP: Record<AI_MODELS, ModelType> = {
  [AI_MODELS.SPARK_LITE]: 'sparkLite',
  [AI_MODELS.GPT]: 'gpt',
};
