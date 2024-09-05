import { CompleteEntity } from '@/common/entity/common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'menu' })
export class MenuEntity extends CompleteEntity {
  @ApiProperty({ description: '父级菜单' })
  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @ApiProperty({ description: '前端路由地址' })
  @Column()
  path: string;

  @ApiProperty({ description: '前端路由地址名称' })
  @Column()
  name: string;

  @ApiProperty({ description: '前端路由组件' })
  @Column()
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
}
