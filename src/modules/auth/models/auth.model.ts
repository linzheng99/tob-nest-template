import { UserEntity } from '@/modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserModel {
  @ApiProperty({ description: '用户信息' })
  user: UserEntity;

  @ApiProperty({ description: '访问令牌' })
  accessToken: string;

  @ApiProperty({ description: '刷新令牌' })
  refreshToken: string;
}
