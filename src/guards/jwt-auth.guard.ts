import { BusinessException } from '@/common/exceptions/business.exception';
import { AUTH_PUBLIC_KEY } from '@/constants';
import { ErrorEnum } from '@/constants/error-code.constant';
import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  jwtFromRequestFn = ExtractJwt.fromAuthHeaderAsBearerToken();

  constructor(
    private reflector: Reflector,
    @Inject(JwtService)
    private jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const loginAuth = this.reflector.getAllAndOverride<boolean>(
      AUTH_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 携带 token 用户
    if (loginAuth) return true;

    // 是否有认证
    const authorization = request.headers.authorization;
    if (!authorization) throw new UnauthorizedException('未登录');

    const token = this.jwtFromRequestFn(request);
    let result: any = false;

    try {
      // 是否允许请求
      result = await super.canActivate(context);
    } catch (err) {
      if (err instanceof UnauthorizedException)
        throw new BusinessException(ErrorEnum.INVALID_LOGIN);

      // 校验 token 有效期
      const user = this.jwtService.verify(token);
      if (!Boolean(user)) throw new BusinessException(ErrorEnum.INVALID_LOGIN);
    }

    return result;
  }
}
