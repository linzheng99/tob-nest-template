import { PagerDto } from '@/common/dto/pager.dto';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @ApiProperty({ description: '用户昵称', example: '管理员', default: null })
  @ApiPropertyOptional()
  @IsString()
  nickName?: string;

  @ApiProperty({ description: '用户密码' })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
  password: string;

  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  email: string;

  @ApiProperty({ description: '角色' })
  @IsNotEmpty({
    message: '角色不能为空',
  })
  roleIds: number[];
}

export class UserQueryDto extends IntersectionType(
  PagerDto,
  PartialType(RegisterUserDto),
) {}
