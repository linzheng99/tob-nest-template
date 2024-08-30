import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const { port, globalPrefix } = configService.get('app');

  // 设置全局接口前缀
  app.setGlobalPrefix(globalPrefix);

  // api 文档
  setupSwagger(app, configService);

  await app.listen(port);
}
bootstrap();
