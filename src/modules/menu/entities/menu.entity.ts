import { CompleteEntity } from '@/common/entity/common.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'menu' })
export class MenuEntity extends CompleteEntity {
  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column()
  path: string;
  @Column()
  name: string;

  @Column()
  component: string;

  @Column({ type: 'json', nullable: true })
  meta: {
    title: string;
    icon: string;
  };

  @Column({ nullable: true })
  redirect?: string;
}
