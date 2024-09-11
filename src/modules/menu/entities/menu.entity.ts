import { CompleteEntity } from '@/common/entity/common.entity';
import { RoleEntity } from '@/modules/role/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, Relation } from 'typeorm';

@Entity({ name: 'menu' })
export class MenuEntity extends CompleteEntity {
  @ApiProperty({ description: '菜单类型' })
  @Column({ type: 'tinyint', default: 0 })
  type: number;

  @ApiProperty({ description: '父级菜单' })
  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @ApiProperty({ description: '前端路由地址' })
  @Column({ nullable: true })
  path: string;

  @ApiProperty({ description: '前端路由地址名称' })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({ description: '前端路由组件' })
  @Column({ nullable: true })
  component: string;

  @ApiProperty({ description: '前端路由元信息' })
  @Column({ type: 'json', nullable: null })
  meta: {
    title: string;
    icon: string;
  };

  @ApiProperty({ description: '前端路由重定向' })
  @Column({ nullable: true })
  redirect?: string;

  @Column({ name: 'order_no', type: 'int', nullable: true, default: 0 })
  orderNo: number;

  @ApiProperty({ description: '菜单权限' })
  @Column({ nullable: true })
  permission: string;

  @ManyToMany(() => RoleEntity, (role) => role.menus, {
    onDelete: 'CASCADE',
  })
  roles: Relation<RoleEntity[]>;
}
