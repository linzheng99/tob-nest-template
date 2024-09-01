import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';

const transformer: ValueTransformer = {
  to(value) {
    return value;
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
