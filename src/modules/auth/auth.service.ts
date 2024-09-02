import { Injectable } from '@nestjs/common';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { md5 } from '@/utils';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IJWtConfig } from '@/config';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ErrorEnum } from '@/constants/error-code.constant';
import { UserService } from '../user/user.service';
import { RedisService } from '@/shared/redis/redis.service';
import { genAuthTokenKey } from '@/utils/redis';

type Token = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { jwtExpires } = this.configService.get<IJWtConfig>('jwt');
    const user = await this.userService.findUserByUserName(
      loginUserDto.username,
    );

    if (!user) throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);
    if (user.password !== md5(loginUserDto.password))
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD);

    const { accessToken, refreshToken } = this.generateToken(user);

    await this.redisService.set(
      genAuthTokenKey(user.id),
      accessToken,
      jwtExpires,
    );

    delete user.password;

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  generateToken(user: UserEntity): Token {
    const { jwtExpires, refreshExpire } =
      this.configService.get<IJWtConfig>('jwt');

    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    };

    // 生成accessToken
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: jwtExpires,
    });
    // 生成refreshToken
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshExpire,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
