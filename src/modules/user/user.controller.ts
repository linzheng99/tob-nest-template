import {
  Controller,
  Delete,
  Param,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { genAuthTokenKey } from '@/utils/redis';
import { AuthUser } from '@/common/decorators/auth-user.decorator';
import { RedisService } from '../../shared/redis/redis.service';
import { JwtAuthGuard, JwtUserData } from '../auth/guards/jwt-auth.guard';
import { ApiSecurityAuth } from '@/common/decorators/swagger.decorator';
import { ApiResult } from '@/common/decorators/api-result.decorator';
import { UserEntity } from './entities/user.entity';
import { UserQueryDto } from './dto/user.dto';

@ApiTags('User - 用户模块')
@ApiSecurityAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private redisService: RedisService,
  ) {}

  @Get('logout')
  @ApiOperation({ summary: '用户登出' })
  async logout(@AuthUser() user: JwtUserData) {
    const accessToken = await this.redisService.get(
      genAuthTokenKey(user.userId),
    );
    return await this.userService.logout(user, accessToken);
  }

  @Get('list')
  @ApiOperation({ summary: '用户分页列表' })
  @ApiResult({ type: [UserEntity], isPage: true })
  async userList(@Query() dto: UserQueryDto) {
    return await this.userService.list(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  async delete(@Param('id') id: number) {
    return await this.userService.delete(+id);
  }
}
