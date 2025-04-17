import { MinLength, IsOptional, IsEmail, Length } from 'class-validator';

export class LoginUserDto {
  @IsOptional()
  username?: string;

  @IsOptional()
  @MinLength(6, { message: '密码最少 6 位' })
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Length(6)
  code?: string;
}
