import { Body, Controller, Get, Post, Sse, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs';
import { ReqChatParamsType } from './chat.type';
import { AI_MODELS } from 'src/constants/chat';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Post()
  generateAnswer(@Body() body: any) {
    // todo: any类型替换为实际类型
    body;
    // const response = this.chatService.getResponse(message);
    return '';
  }
  @Post('/once')
  async generateOneTimeAnswer(@Body() params: ReqChatParamsType) {
    const message = await this.chatService.sealMessage(params);
    const result = message;
    return result;
  }
  @Get('/once')
  async generateOneTimeAnswer2(
    @Query('content') content: string,
    @Query('model') model: AI_MODELS,
    @Query('role') role: string,
  ) {
    const message = await this.chatService.sealMessage({
      content,
      model,
      role,
    });
    const result = message;
    return result;
  }
  @Sse('/stream')
  async generateStreamAnswer(
    @Query('content') content: string,
    @Query('model') model: AI_MODELS,
    @Query('role') role: string,
  ) {
    return new Observable((observer) => {
      this.handleStreamAnswer({ content, model, role }, observer).catch(
        (err) => {
          observer.error({
            data: JSON.stringify({
              error: err.message,
              type: 'error',
            }),
          });
        },
      );
    });
  }
  // 处理调用流式服务
  private async handleStreamAnswer(params: ReqChatParamsType, observer: any) {
    try {
      // 调用流式服务
      const stream = await this.chatService.sealMessage(params, true);

      // 处理流式数据
      for await (const chunk of stream) {
        const contentChunk = this.chatService.parseChunk(chunk);
        if (contentChunk) {
          observer.next({ d: contentChunk });
        }
      }

      // 处理完成
      observer.next({
        f: 'finished',
      });
      observer.complete();
    } catch (err) {
      observer.error({
        e: err.message,
      });
    }
  }
}
