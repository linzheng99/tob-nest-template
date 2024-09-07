import { Column, Entity, JoinTable, ManyToMany, Relation } from 'typeorm';
import { CommonEntity } from '@/common/entity/common.entity';
import { MenuEntity } from '@/modules/menu/entities/menu.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity({
  name: 'roles',
})
export class RoleEntity extends CommonEntity {
  @Column({
    length: 20,
    comment: '角色名',
  })
  name: string;

  @ApiHideProperty()
  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: Relation<UserEntity[]>;

  @ManyToMany(() => MenuEntity, (menu) => menu.roles, {})
  @JoinTable({
    name: 'role_menus',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
  })
  menus: Relation<MenuEntity[]>;
}
