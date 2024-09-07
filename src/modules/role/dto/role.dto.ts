import { OperatorDto } from '@/common/dto/operator.dto';
import { PagerDto } from '@/common/dto/pager.dto';
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RoleDto extends OperatorDto {
  @ApiProperty({ description: '角色名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '角色备注' })
  @IsOptional()
  remark?: string;

  @ApiProperty({ description: '关联菜单id' })
  @IsOptional()
  menuIds?: number[];
}

export class UpdateRoleDto extends PartialType(RoleDto) {}

export class RoleQueryDto extends IntersectionType(
  PagerDto,
  PartialType(RoleDto),
) {}
