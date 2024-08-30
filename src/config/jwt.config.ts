import { getEnvNumber, getEnvString } from '@/utils';
import { ConfigType, registerAs } from '@nestjs/config';

export const jwtRegToken = 'jwt';

export const JwtConfig = registerAs(jwtRegToken, () => ({
  jwtSecret: getEnvString('JWT_SECRET'),
  jwtExpires: getEnvNumber('JWT_EXPIRES'),
  refreshSecret: getEnvString('REFRESH_TOKEN_SECRET'),
  refreshExpire: getEnvNumber('REFRESH_TOKEN_EXPIRE'),
}));

export type IJWtConfig = ConfigType<typeof JwtConfig>;
