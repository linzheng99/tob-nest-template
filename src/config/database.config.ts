import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigType, registerAs } from '@nestjs/config';
import { getEnvBoolean, getEnvNumber, getEnvString } from '../utils';

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
  extra: {
    authPlugins: 'sha256_password',
  },
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
};

export const dbRegToken = 'database';

export const DatabaseConfig = registerAs(
  dbRegToken,
  (): DataSourceOptions => dataSourceOptions,
);

export type IDatabaseConfig = ConfigType<typeof DatabaseConfig>;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
