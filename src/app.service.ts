import { Injectable } from '@nestjs/common';
import { getEnvNumber } from './utils';

@Injectable()
export class AppService {
  async getHello() {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    console.log();
    return {
      port: getEnvNumber('DB_PORT'),
    };
  }
}
