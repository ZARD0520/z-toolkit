import axios from 'axios';
import { modelConfigParamsType, modelConfigType } from '../chat.type';
import { Readable } from 'stream';
import { createInterface } from 'readline';

const chatInfo = {
  url: process.env.XF_APP_URL,
  appId: process.env.XF_APP_ID,
  appSecret: process.env.XF_APP_SECRET,
  appKey: process.env.XF_APP_KEY,
  appPassword: process.env.XF_APP_PASSWORD,
};

const getModelConfig = (rolePreset: string, stream: boolean) => {
  return {
    headers: {
      Authorization: `Bearer ${chatInfo.appPassword}`,
    },
    data: {
      model: 'lite',
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

export const sealSparkMessage = (
  text: string,
  config: modelConfigParamsType,
) => {
  const modelConfig = getModelConfig(config.rolePreset, config.isStream);
  return config.isStream
    ? getResponseStream(text, modelConfig)
    : getResponse(text, modelConfig);
};

// 发起请求获取大模型回应
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

// 发起流式请求获取大模型回应
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
    // 根据讯飞星火API的格式解析
    if (chunk.choices && chunk.choices[0] && chunk.choices[0].delta) {
      return chunk.choices[0].delta.content || '';
    }
    return '';
  } catch {
    return '';
  }
};
