import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local')) // 使用 LocalStrategy
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('profile')
  @UseGuards(AuthGuard('jwt')) // 使用 JwtStrategy
  async profile(@Request() req: any) {
    return req.user; // 返回当前用户信息
  }
}
