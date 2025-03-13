import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  async register(registerUserDto: RegisterUserDto) {
    // const users: User[] = await this.dbService.read();

    // const foundUser = users.find(item => item.username === registerUserDto.username);

    // if (foundUser) {
    //   throw new BadRequestException('该用户已经注册');
    // }

    const user = new User();
    user.username = registerUserDto.username;
    user.password = registerUserDto.password;
    // users.push(user);

    // await this.dbService.write(users);
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    // const users: User[] = await this.dbService.read();
    // const foundUser = users.find(item => item.username === loginUserDto.username);
    // if(!foundUser) {
    //     throw new BadRequestException('用户不存在');
    // }
    // if(foundUser.password !== loginUserDto.password) {
    //     throw new BadRequestException('密码不正确');
    // }
    // return foundUser;
    return loginUserDto;
  }
}
