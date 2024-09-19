import { OperatorDto } from '@/common/dto/operator.dto';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class MenuDto extends OperatorDto {
  @ApiProperty({ description: '菜单类型' })
  @IsIn([0, 1, 2])
  type: number;

  @ApiProperty({ description: '父级菜单' })
  @ApiPropertyOptional()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ description: '前端路由地址' })
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => o.type === 1)
  @IsNotEmpty({
    message: '前端路由地址不能为空',
  })
  path?: string;

  @ApiProperty({ description: '前端路由地址名称' })
  @ValidateIf((o) => o.type !== 2)
  @IsNotEmpty({
    message: '前端路由地址名称不能为空',
  })
  name: string;

  @ApiProperty({ description: '前端路由组件' })
  @ValidateIf((o) => o.type !== 2)
  @IsNotEmpty({
    message: '前端路由组件不能为空',
  })
  component: string;

  @ApiProperty({ description: '前端路由元信息' })
  @ApiPropertyOptional()
  @IsOptional()
  meta?: {
    title: string;
    icon: string;
  };

  @ApiProperty({ description: '对应权限' })
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @ValidateIf((o: MenuDto) => o.type === 2)
  permission: string;

  @ApiProperty({ description: '前端路由重定向' })
  @ApiPropertyOptional()
  @IsOptional()
  redirect?: string;

  @ApiProperty({ description: '外链地址' })
  @ApiPropertyOptional()
  @IsOptional()
  external?: string;

  @ApiProperty({ description: '排序' })
  @IsInt()
  @Min(0)
  orderNo: number;
}

export class MenuUpdateDto extends PartialType(MenuDto) {}
