import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @ApiProperty({ description: '用户昵称', example: '管理员' })
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
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => o.email)
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  email?: string;
}
