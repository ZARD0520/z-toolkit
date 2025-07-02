import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // 生成 JWT
  async generate(user: User) {
    const payload = {
      username: user.username,
      userId: user.id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '30m',
      }),
      refresh_token: this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn: '7d',
        },
      ),
    };
  }

  // 校验token
  async verify(refreshToken: string) {
    return this.jwtService.verify(refreshToken);
  }
}
