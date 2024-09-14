import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TypeORMLogger } from './typeorm-logger';
import { IDatabaseConfig } from '@/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        ...configService.get<IDatabaseConfig>('database'),
        autoLoadEntities: true,
        logging: ['error'],
        logger: new TypeORMLogger(['error']),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
