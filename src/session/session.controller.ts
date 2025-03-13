import { Controller, Get, Res } from '@nestjs/common';
import { SessionService } from './session.service';
import { Response } from 'express';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('id')
  async getSessionId(@Res() res: Response) {
    const sessionId = this.sessionService.generateSessionId();
    await this.sessionService.storeSessionId(sessionId);

    res.json({ sessionId });
  }
}
