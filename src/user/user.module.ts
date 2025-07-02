import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from '../config/redis/redis.service';
import { RedisModule } from '../config/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), RedisModule],
  controllers: [UserController],
  providers: [RedisService, UserService],
})
export class UserModule {}
