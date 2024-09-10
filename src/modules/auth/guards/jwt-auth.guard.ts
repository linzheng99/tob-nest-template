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
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AUTH_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 无需校验
    if (isPublic) return true;

    // 是否有认证
    const authorization = request.headers.authorization;
    if (!authorization) throw new UnauthorizedException('未登录');

    const token = this.jwtFromRequestFn(request);

    // 检查 token 是否在黑名单中
    if (await this.redisService.get(genTokenBlacklistKey(token)))
      throw new BusinessException(ErrorEnum.INVALID_LOGIN);

    let result: any = false;

    try {
      result = await super.canActivate(context);
    } catch (err) {
      // 判断 token 是否有效且存在, 如果不存在则认证失败
      const isValid = !!token
        ? undefined
        : this.jwtService.verify<JwtUserData>(token);

      if (err instanceof UnauthorizedException)
        throw new BusinessException(ErrorEnum.INVALID_LOGIN);

      if (!isValid) throw new BusinessException(ErrorEnum.INVALID_LOGIN);
    }

    return result;
  }

  handleRequest(err, user) {
    if (err || !user) throw err || new UnauthorizedException();

    return user;
  }
}
