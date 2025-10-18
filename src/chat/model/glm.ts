import axios from 'axios';
import { getModelConfig } from '../../utils/model';
import { ChatInfo, modelConfigParamsType, modelConfigType } from '../chat.type';
import { Readable } from 'stream';
import { createInterface } from 'readline';

const chatInfo: ChatInfo = {
  url: process.env.ZP_APP_URL as string,
  appKey: process.env.ZP_APP_KEY,
  model: 'glm-4.5',
};

export const sealGlmMessage = (text: string, config: modelConfigParamsType) => {
  const modelConfig = getModelConfig(
    config.rolePreset,
    config.isStream,
    chatInfo,
  );
  return config.isStream
    ? getResponseStream(text, modelConfig)
    : getResponse(text, modelConfig);
};

// 普通对话
const getResponse = async (text: string, modelConfig: modelConfigType) => {
  try {
    const { headers, data } = modelConfig;
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
    } = await axios.post(chatInfo.url as string, data, {
      headers,
    });

    return code === 0
      ? choices?.[0]?.message?.content ??
          `出错啦，错误信息：${message}，错误码：${code}`
      : `出错啦，错误信息：${message}，错误码：${code}`;
  } catch (e) {
    if (e.response) {
      console.error(e.response.data);
      return `服务端返回错误，错误状态码:${e.response.status}，错误信息:${e.response.data}`;
    } else if (e.request) {
      return `网络错误：${e.message}`;
    }
    return `出错啦，错误信息：${e.message ?? e}`;
  }
};

// 流式对话
async function* getResponseStream(text: string, modelConfig: modelConfigType) {
  try {
    const { headers, data } = modelConfig;
    data.messages.push({
      role: 'user',
      content: text,
    });
    const response = await axios.post(chatInfo.url as string, data, {
      headers,
      responseType: 'stream',
      timeout: 60000,
    });
    yield* processStreamResponse(response.data);
  } catch (e) {
    if (e.response) {
      console.error(e.response.data);
      return `服务端返回错误，错误状态码:${e.response.status}，错误信息:${e.response.data}`;
    } else if (e.request) {
      return `网络错误：${e.message}`;
    }
    return `出错啦，错误信息：${e.message ?? e}`;
  }
}

async function* processStreamResponse(stream: Readable) {
  const rl = createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (line.startsWith('data: ')) {
      const dataStr = line.slice(6); // 移除 'data: ' 前缀

      if (dataStr === '[DONE]') {
        break; // 流结束
      }

      try {
        const data = JSON.parse(dataStr);
        console.log(data);
        yield data;
      } catch (parseError) {
        // 忽略解析错误，继续处理下一行
        console.warn('Parse line error:', parseError);
        continue;
      }
    }
  }
}

export const parseChunk = (chunk: any) => {
  try {
    // 根据智谱API的格式解析
    if (chunk.choices && chunk.choices[0] && chunk.choices[0].delta) {
      return chunk.choices[0].delta.content || '';
    }
    return '';
  } catch {
    return '';
  }
};
