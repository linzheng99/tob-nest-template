import { ApiProperty } from '@nestjs/swagger';

import { RoleEntity } from '../entities/role.entity';

export class RoleInfo extends RoleEntity {
  @ApiProperty({ type: [Number] })
  menuIds: number[];
}
