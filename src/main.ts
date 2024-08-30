import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './setup-swagger';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import type { IAppConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const { port, globalPrefix } = configService.get<IAppConfig>('app');

  // 设置全局接口前缀
  app.setGlobalPrefix(globalPrefix);

  // api 文档
  setupSwagger(app, configService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) =>
        new UnprocessableEntityException(
          errors.map((e) => {
            const rule = Object.keys(e.constraints!)[0];
            const msg = e.constraints![rule];
            return msg;
          })[0],
        ),
    }),
  );

  await app.listen(port);
}
bootstrap();
