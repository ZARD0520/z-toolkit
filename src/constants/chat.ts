import { RolePreset } from '../chat/role-presets';
import { ModelType } from '../chat/chat.type';

export enum AI_MODELS {
  SPARK_LITE = '1',
  GPT = '2',
  GLM = '3',
}

export enum AI_ROLE {
  ZARD = '1',
  PROGRAMMER = '2',
  CAT = '3',
}

export const MODEL_MAP: Record<AI_MODELS, ModelType> = {
  [AI_MODELS.SPARK_LITE]: 'sparkLite',
  [AI_MODELS.GPT]: 'gpt',
  [AI_MODELS.GLM]: 'glm',
};

export const ROLE_MAP: Record<AI_ROLE, RolePreset> = {
  [AI_ROLE.ZARD]: 'zard',
  [AI_ROLE.PROGRAMMER]: 'programmer',
  [AI_ROLE.CAT]: 'cat',
};
