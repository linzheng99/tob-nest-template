import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { RoleEntity } from '@/modules/role/entities/role.entity';
import { Permission } from '@/modules/user/entities/permission.entity';
import { MenuEntity } from '@/modules/menu/entities/menu.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: [UserEntity, RoleEntity, Permission, MenuEntity], // 数据表实体
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
