import { getEnvBoolean, getEnvString } from '@/utils';
import { registerAs } from '@nestjs/config';

export const swaggerRegToken = 'swagger';

export const SwaggerConfig = registerAs(swaggerRegToken, () => ({
  enable: getEnvBoolean('SWAGGER_ENABLE'),
  path: getEnvString('SWAGGER_PATH'),
  version: getEnvString('SWAGGER_VERSION'),
}));
