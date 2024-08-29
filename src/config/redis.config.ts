import { getEnvNumber, getEnvString } from '@/utils';
import { registerAs } from '@nestjs/config';

export const redisRegToken = 'redis';

export const RedisConfig = registerAs(redisRegToken, () => ({
  host: getEnvString('REDIS_HOST'),
  port: getEnvNumber('REDIS_PORT'),
  db: getEnvNumber('REDIS_DB'),
}));
