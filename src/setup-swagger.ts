import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { IAppConfig, ISwaggerConfig } from './config';
import { CommonEntity } from './common/entity/common.entity';
import { ResOp, TreeResult } from './common/model/response.model';
import { API_SECURITY_AUTH } from './common/decorators/swagger.decorator';
import { Pagination } from './helper/pagination';

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
    .addSecurity(API_SECURITY_AUTH, {
      description: '输入令牌（Enter the token）',
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    ignoreGlobalPrefix: false,
    extraModels: [CommonEntity, ResOp, TreeResult, Pagination],
  });

  SwaggerModule.setup(path, app, document);
}
