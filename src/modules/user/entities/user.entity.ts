import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { CommonEntity } from '@/common/entity/common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'users',
})
export class UserEntity extends CommonEntity {
  @ApiProperty({ description: '用户名' })
  @Column({
    length: 50,
    comment: '用户名',
    unique: true,
  })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ description: '昵称' })
  @Column({
    name: 'nick_name',
    length: 50,
    comment: '昵称',
  })
  nickName: string;

  @ApiProperty({ description: '邮箱' })
  @Column({
    comment: '邮箱',
    length: 50,
  })
  email: string;

  @ApiProperty({ description: '是否冻结' })
  @Column({
    comment: '是否冻结',
    default: false,
  })
  isFrozen: boolean;

  @ApiProperty({ description: '角色' })
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[];
}
