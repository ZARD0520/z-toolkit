import { ChatInfo } from '../chat/chat.type';

export const getModelConfig = (
  rolePreset: string,
  stream: boolean,
  chatInfo: ChatInfo,
) => {
  return {
    headers: {
      Authorization: `Bearer ${chatInfo.appKey}`,
    },
    data: {
      model: chatInfo.model,
      messages: [
        {
          role: 'system',
          content: rolePreset,
        },
      ],
      stream,
    },
  };
};
