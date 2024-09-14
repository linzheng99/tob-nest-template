import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionFilter } from './common/exceptions/base.exception.filter';
import { TransformInterceptor } from './common/interceptors/transform/transform.interceptor';
import { DatabaseModule } from './shared/database/database.module';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './shared/redis/redis.module';
import { DatabaseConfig, RedisConfig } from './config';
import { AppConfig } from './config/app.config';
import { SwaggerConfig } from './config/swagger.config';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { JwtConfig } from './config/jwt.config';
import { MenuModule } from './modules/menu/menu.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionGuard } from './modules/auth/guards/permission.guard';
import { LoggerModule } from './shared/logger/logger.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      // 指定多个 env 文件时，第一个优先级最高
      // envFilePath: path.join(__dirname, '.env'),
      // envFilePath: [path.join(__dirname, '.env')],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [AppConfig, SwaggerConfig, DatabaseConfig, RedisConfig, JwtConfig],
    }),
    DatabaseModule,
    UserModule,
    RedisModule,
    AuthModule,
    MenuModule,
    RoleModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
    AppService,
  ],
})
export class AppModule {}
