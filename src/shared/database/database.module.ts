import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '@/modules/user/entities/user.entity';
import { Role } from '@/modules/user/entities/role.entity';
import { Permission } from '@/modules/user/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: [User, Role, Permission], // 数据表实体
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
