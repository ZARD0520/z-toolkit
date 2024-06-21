import { Body, Controller, Post } from '@nestjs/common';
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
    const message = this.chatService.sealMessage(content);
    const response = this.chatService.getResponse(message);

    const result = response; // todo: 编写服务从response中解出那条消息的内容文本
    return result;
  }
}
