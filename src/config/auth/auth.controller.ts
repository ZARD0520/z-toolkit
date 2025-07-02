import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local')) // 使用 LocalStrategy
  async login(@Request() req: any) {
    try {
      const user = await this.userService.login(req.user);
      const res = this.authService.generate(user);
      return res;
    } catch (e) {
      throw new HttpException(e.message || '登录失败', HttpStatus.ACCEPTED);
    }
  }

  @Get('refresh')
  async refresh(@Query('refresh_token') refreshToken: string) {
    try {
      const data = await this.authService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId);

      if (!user) {
        return new UnauthorizedException('用户不存在');
      }

      const res = this.authService.generate(user);
      return res;
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @Post('profile')
  @UseGuards(AuthGuard('jwt')) // 使用 JwtStrategy
  async profile(@Request() req: any) {
    return req.user; // 返回当前用户信息
  }
}
