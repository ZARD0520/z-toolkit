import { Injectable } from '@nestjs/common';

@Injectable()
export class WxService {
  getHello(): string {
    return '哎呀呀';
  }
}
