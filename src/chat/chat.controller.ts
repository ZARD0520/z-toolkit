import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

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
    const result = message; // todo: 编写服务从response中解出那条消息的内容文本
    return result;
  }
  @Get('/once')
  async generateOneTimeAnswer2() {
    const content = '黄俊杰是谁';
    const message = await this.chatService.sealMessage(content);
    const result = message; // todo: 编写服务从response中解出那条消息的内容文本
    return result;
  }
}
