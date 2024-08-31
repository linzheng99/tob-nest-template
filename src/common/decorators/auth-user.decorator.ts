import { JwtUserData } from '@/modules/auth/guards/jwt-auth.guard';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

type Payload = keyof JwtUserData;

/**
 * @description 获取当前登录用户信息, 并挂载到request上
 */
export const AuthUser = createParamDecorator(
  (data: Payload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user) {
      return null;
    }
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
