import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleRepository: Repository<Role>,
  ) {}
  async register(registerUserDto: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'user' },
    });
    if (!defaultRole) {
      throw new Error('Default role "user" not found');
    }

    const user = this.userRepository.create({
      username: registerUserDto.username,
      password: hashedPassword,
      email: registerUserDto.email,
      roles: [defaultRole], // 默认角色
    });

    return this.userRepository.save(user);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
      },
      relations: {
        roles: true,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.ACCEPTED);
    }

    if (user.password !== loginUserDto.password) {
      throw new HttpException('密码错误', HttpStatus.ACCEPTED);
    }

    return user;
  }

  // 查找用户（用于登录校验）
  async findOne(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  // 查找用户
  async findUserById(userId: number) {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  // 校验密码
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async findRolesByIds(roleIds: number[]) {
    return this.roleRepository.find({
      where: {
        id: In(roleIds),
      },
      relations: {
        permissions: true,
      },
    });
  }
}
