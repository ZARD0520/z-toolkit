import { applyDecorators, Get, UseGuards } from '@nestjs/common';
import { TestA } from './test.decorator';
import { AaaGuard } from '../guard/test.guard';

export function Bbb(path: any, role: any) {
  return applyDecorators(Get(path), TestA(role), UseGuards(AaaGuard));
}
