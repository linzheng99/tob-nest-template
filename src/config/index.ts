import { appRegToken, IAppConfig } from './app.config';
import { dbRegToken, IDatabaseConfig } from './database.config';
import { IJWtConfig, jwtRegToken } from './jwt.config';
import { IRedisConfig, redisRegToken } from './redis.config';
import { ISwaggerConfig, swaggerRegToken } from './swagger.config';

export * from './database.config';
export * from './redis.config';
export * from './jwt.config';
export * from './swagger.config';
export * from './app.config';

export interface AllConfigType {
  [appRegToken]: IAppConfig;
  [dbRegToken]: IDatabaseConfig;
  [redisRegToken]: IRedisConfig;
  [jwtRegToken]: IJWtConfig;
  [swaggerRegToken]: ISwaggerConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;
