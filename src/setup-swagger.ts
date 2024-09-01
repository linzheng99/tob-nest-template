import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { IAppConfig, ISwaggerConfig } from './config';
import { CommonEntity } from './common/entity/common.entity';
import { ResOp } from './common/model/response.model';

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
): void {
  const { name } = configService.get<IAppConfig>('app');
  const { enable, path, version } =
    configService.get<ISwaggerConfig>('swagger');

  if (!enable) return;

  const options = new DocumentBuilder()
    .setTitle(name)
    .setDescription(`${name} API document`)
    .setVersion(version)
    .addBearerAuth({
      description: '输入令牌（Enter the token）',
      type: 'http',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    ignoreGlobalPrefix: false,
    extraModels: [CommonEntity, ResOp],
  });

  SwaggerModule.setup(path, app, document);
}
