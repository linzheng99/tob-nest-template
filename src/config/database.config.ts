import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';
import { getEnvBoolean, getEnvNumber, getEnvString } from '@/utils';

config({ path: `.env.${process.env.NODE_ENV}` });

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: getEnvString('DB_HOST'),
  port: getEnvNumber('DB_PORT'),
  username: getEnvString('DB_USERNAME'),
  password: getEnvString('DB_PASSWORD'),
  database: getEnvString('DB_DATABASE'),
  synchronize: getEnvBoolean('DB_SYNCHRONIZE'),
  timezone: '+08:00', //服务器上配置的时区
  connectorPackage: 'mysql2',
};

export const dbRegToken = 'database';

export const DatabaseConfig = registerAs(
  dbRegToken,
  (): DataSourceOptions => dataSourceOptions,
);
