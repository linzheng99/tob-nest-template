import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '@/modules/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: [User], // 数据表实体
        logging: true,
        extra: {
          authPlugins: 'sha256_password',
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
