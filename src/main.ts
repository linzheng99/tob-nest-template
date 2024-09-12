import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './setup-swagger';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import type { IAppConfig } from './config';
import { LoggerService } from './shared/logger/logger.service';
import { isDev } from './global';
import { LoggingInterceptor } from './common/interceptors/logger/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const { port, globalPrefix } = configService.get<IAppConfig>('app');

  // 设置全局接口前缀
  app.setGlobalPrefix(globalPrefix);

  // api 文档
  setupSwagger(app, configService);

  if (isDev) app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 将输入数据转换为 DTO 类型
      whitelist: true, // 只允许 DTO 中定义的属性，过滤掉多余的属性
      transformOptions: { enableImplicitConversion: true }, // 启用隐式转换，例如将字符串转换为数字
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // 设置错误响应状态码为 422
      stopAtFirstError: true, // 遇到第一个验证错误时停止验证
      // 自定义异常工厂，用于处理验证错误
      exceptionFactory: (errors) =>
        new UnprocessableEntityException(
          errors.map((e) => {
            const rule = Object.keys(e.constraints!)[0];
            const msg = e.constraints![rule];
            return msg;
          })[0], // 只返回第一个错误消息
        ),
    }),
  );

  // 启动跨域
  app.enableCors();

  // 日志收集
  app.useLogger(app.get(LoggerService));

  await app.listen(port);
}
bootstrap();
