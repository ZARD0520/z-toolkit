import { AppService } from '../../app.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class TestMiddleware implements NestMiddleware {
  constructor(private readonly appService: AppService) {}

  use(req: Request, res: Response, next: () => void) {
    console.log('brefore' + this.appService.getHello());
    next();
    console.log('after');
  }
}
