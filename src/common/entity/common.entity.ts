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
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at', transformer })
  createTime: Date;

  @UpdateDateColumn({ name: 'updated_at', transformer })
  updateTime: Date;
}
