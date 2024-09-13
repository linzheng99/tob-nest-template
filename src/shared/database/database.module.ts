import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { RoleEntity } from '@/modules/role/entities/role.entity';
import { MenuEntity } from '@/modules/menu/entities/menu.entity';
import { TypeORMLogger } from './typeorm-logger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
        // entities: [UserEntity, RoleEntity, MenuEntity], // 数据表实体
        autoLoadEntities: true,
        logging: ['error'],
        logger: new TypeORMLogger(['error']),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
