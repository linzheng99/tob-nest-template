import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import * as dayjs from 'dayjs';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';

const transformer: ValueTransformer = {
  to(value) {
    return dayjs(value).toDate();
  },
  from(value) {
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
  },
};

export abstract class CommonEntity extends BaseEntity {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'created_at', transformer })
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ name: 'updated_at', transformer })
  updateTime: Date;
}

export abstract class CompleteEntity extends CommonEntity {
  @ApiHideProperty()
  @Exclude()
  @Column({
    name: 'create_by',
    update: false,
    comment: '创建者',
    nullable: true,
  })
  createBy: number;

  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'update_by', comment: '更新者', nullable: true })
  updateBy: number;
}
