import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true; // 如果没有角色限制，直接放行

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (
      !user?.roles ||
      !user.roles.some((role: string) => requiredRoles.includes(role))
    ) {
      throw new ForbiddenException('无权访问');
    }

    return true;
  }
}
