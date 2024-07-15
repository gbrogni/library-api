import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public';
import { UserPayload } from './jwt.strategy';
import { ROLES_KEY } from './roles';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || ['COMMON', 'ADMIN'];

    return Promise.resolve(super.canActivate(context)).then((authResult) => {
      if (!authResult) {
        return false;
      }
      const request = context.switchToHttp().getRequest();
      const user: UserPayload = request.user;

      const hasRequiredRole = requiredRoles.some(role => user.role?.includes(role));
      console.log('hasRequiredRole', hasRequiredRole);
      return hasRequiredRole;
    });
  }
}