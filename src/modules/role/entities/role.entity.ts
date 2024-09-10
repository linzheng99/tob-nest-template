import { Column, Entity, JoinTable, ManyToMany, Relation } from 'typeorm';
import { CommonEntity } from '@/common/entity/common.entity';
import { MenuEntity } from '@/modules/menu/entities/menu.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'roles',
})
export class RoleEntity extends CommonEntity {
  @ApiProperty({ description: '角色名' })
  @Column({
    length: 20,
    unique: true,
    comment: '角色名',
  })
  name: string;

  @ApiProperty({ description: '角色描述' })
  @Column({ nullable: true })
  remark: string;

  @ApiHideProperty()
  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: Relation<UserEntity[]>;

  @ApiHideProperty()
  @ManyToMany(() => MenuEntity, (menu) => menu.roles, {})
  @JoinTable({
    name: 'role_menus',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
  })
  menus: Relation<MenuEntity[]>;
}
