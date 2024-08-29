import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello() {
    return {
      env: process.env.NODE_ENV,
    };
  }
}
