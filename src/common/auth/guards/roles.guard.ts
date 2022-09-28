import {Reflector} from '@nestjs/core';
import {UserInfo} from 'src/common/dto/reqUserInfo.Dto';
import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserInfo = request.user;

    return user?.role && roles.includes(user.role);
  }
}
