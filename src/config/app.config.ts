import { getEnvNumber, getEnvString } from '@/utils';
import { ConfigType, registerAs } from '@nestjs/config';

export const appRegToken = 'app';

export const AppConfig = registerAs(appRegToken, () => ({
  name: getEnvString('APP_NAME'),
  port: getEnvNumber('APP_PORT'),
  globalPrefix: getEnvString('APP_GLOBAL_PREFIX'),
  logger: {
    level: getEnvString('LOGGER_LEVEL'),
    maxFiles: getEnvNumber('LOGGER_MAX_FILES'),
  },
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
