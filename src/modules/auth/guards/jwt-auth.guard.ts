import { BusinessException } from '@/common/exceptions/business.exception';
import { AUTH_PUBLIC_KEY } from '@/constants';
import { ErrorEnum } from '@/constants/error-code.constant';
import { RedisService } from '@/shared/redis/redis.service';
import { genTokenBlacklistKey } from '@/utils/redis';
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

// TODO 后续需要调整
export interface JwtUserData {
  userId: number;
  username: string;
  email: string;
  roles: string[];
  /** 过期时间 */
  exp?: number;
  /** 签发时间 */
  iat?: number;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  jwtFromRequestFn = ExtractJwt.fromAuthHeaderAsBearerToken();

  constructor(
    private reflector: Reflector,
    @Inject(JwtService)
    private jwtService: JwtService,
    private redisService: RedisService,
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

    // 检查 token 是否在黑名单中
    if (await this.redisService.get(genTokenBlacklistKey(token)))
      throw new BusinessException(ErrorEnum.INVALID_LOGIN);

    let result: any = false;

    // 校验 token 有效期
    const user = this.jwtService.verify<JwtUserData>(token);

    try {
      // 是否允许请求
      result = await super.canActivate(context);

      request.user = {
        userId: user.userId,
        username: user.username,
        email: user.email,
        roles: user.roles,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException)
        throw new BusinessException(ErrorEnum.INVALID_LOGIN);

      if (!Boolean(user)) throw new BusinessException(ErrorEnum.INVALID_LOGIN);
    }

    return result;
  }

  handleRequest(err, user) {
    if (err || !user) throw err || new UnauthorizedException();

    return user;
  }
}
