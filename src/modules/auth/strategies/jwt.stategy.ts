import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJWtConfig, JwtConfig } from '@/config';
import { JwtUserData } from '../guards/jwt-auth.guard';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(JwtConfig.KEY)
    private jwtConfig: IJWtConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.jwtSecret,
    });
  }

  async validate(payload: JwtUserData) {
    return payload;
  }
}
