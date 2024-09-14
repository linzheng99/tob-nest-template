import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_CLIENT } from '@/constants';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { IRedisConfig } from '@/config';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: REDIS_CLIENT,
      async useFactory(configService: ConfigService) {
        const {
          host,
          port,
          db: database,
        } = configService.get<IRedisConfig>('redis');
        const client = createClient({
          socket: {
            host,
            port,
          },
          database,
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
