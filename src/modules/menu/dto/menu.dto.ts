import { OperatorDto } from '@/common/dto/operator.dto';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class MenuDto extends OperatorDto {
  @ApiProperty({ description: '父级菜单' })
  @ApiPropertyOptional()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ description: '前端路由地址' })
  @IsNotEmpty({
    message: '前端路由地址不能为空',
  })
  path: string;

  @ApiProperty({ description: '前端路由地址名称' })
  @IsNotEmpty({
    message: '前端路由地址名称',
  })
  name: string;

  @ApiProperty({ description: '前端路由组件' })
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

  @ApiProperty({ description: '前端路由重定向' })
  @ApiPropertyOptional()
  @IsOptional()
  redirect?: string;
}

export class MenuUpdateDto extends PartialType(MenuDto) {}
