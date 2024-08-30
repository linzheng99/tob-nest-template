import { getEnvNumber, getEnvString } from '@/utils';
import { registerAs } from '@nestjs/config';

export const appRegToken = 'app';

export const AppConfig = registerAs(appRegToken, () => ({
  name: getEnvString('APP_NAME'),
  port: getEnvNumber('APP_PORT'),
  globalPrefix: getEnvString('APP_GLOBAL_PREFIX'),
}));
