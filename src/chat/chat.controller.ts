import { Body, Controller, Get, Post, Sse, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs';

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
  async generateOneTimeAnswer(@Body() { content }: { content: string }) {
    const message = await this.chatService.sealMessage(content);
    const result = message;
    return result;
  }
  @Get('/once')
  async generateOneTimeAnswer2(@Query('content') content: string) {
    const message = await this.chatService.sealMessage(content);
    const result = message;
    return result;
  }
  @Sse('/stream')
  async generateStreamAnswer(@Query('content') content: string) {
    return new Observable((observer) => {
      this.handleStreamAnswer(content, observer).catch((err) => {
        observer.error({
          data: JSON.stringify({
            error: err.message,
            type: 'error',
          }),
        });
      });
    });
  }
  // 处理调用流式服务
  private async handleStreamAnswer(content: string, observer: any) {
    try {
      // 调用流式服务
      const stream = await this.chatService.sealMessage(content, true);

      let fullContent = '';

      // 处理流式数据
      for await (const chunk of stream) {
        const contentChunk = this.chatService.parseChunk(chunk);
        if (contentChunk) {
          fullContent += contentChunk;
          observer.next({
            data: JSON.stringify({
              type: 'chunk',
              fullContent,
              content: contentChunk,
            }),
          });
        }
      }

      // 处理完成
      observer.next({
        data: JSON.stringify({
          type: 'done',
          fullContent,
        }),
      });
      observer.complete();
    } catch (err) {
      observer.error({
        data: JSON.stringify({
          error: err.message,
          type: 'error',
        }),
      });
    }
  }
}
