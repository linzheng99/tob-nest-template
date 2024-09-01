import { Controller, Delete, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { genAuthTokenKey } from '@/utils/redis';
import { AuthUser } from '@/common/decorators/auth-user.decorator';
import { RedisService } from '../../shared/redis/redis.service';
import { JwtUserData } from '../auth/guards/jwt-auth.guard';

@ApiTags('User - 用户模块')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private redisService: RedisService,
  ) {}

  @ApiBearerAuth()
  @Get('logout')
  @ApiOperation({ summary: '用户登出' })
  async logout(@AuthUser() user: JwtUserData) {
    const accessToken = await this.redisService.get(
      genAuthTokenKey(user.userId),
    );
    return await this.userService.logout(user, accessToken);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  async delete(@Param('id') id: number) {
    return await this.userService.delete(+id);
  }
}
