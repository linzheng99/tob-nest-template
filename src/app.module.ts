import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionFilter } from './common/exceptions/base.exception.filter';
import { TransformInterceptor } from './common/interceptors/transform/transform.interceptor';
import { DatabaseModule } from './shared/database/database.module';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './shared/redis/redis.module';
import { DatabaseConfig, RedisConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      // 指定多个 env 文件时，第一个优先级最高
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [DatabaseConfig, RedisConfig],
    }),
    DatabaseModule,
    UserModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    AppService,
  ],
})
export class AppModule {}
