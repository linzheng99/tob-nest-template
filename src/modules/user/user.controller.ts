import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { genAuthTokenKey } from '@/utils/redis';
import { AuthUser } from '@/common/decorators/auth-user.decorator';
import { RedisService } from '../../shared/redis/redis.service';
import { JwtUserData } from '../auth/guards/jwt-auth.guard';

@ApiTags('user - 用户模块')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private redisService: RedisService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @ApiBearerAuth()
  @Get('logout')
  @ApiOperation({ summary: '用户登出' })
  async logout(@AuthUser() user: JwtUserData) {
    const accessToken = await this.redisService.get(
      genAuthTokenKey(user.userId),
    );
    console.log('accessToken--------------->', accessToken);
    return await this.userService.logout(user, accessToken);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  async delete(@Param('id') id: number) {
    return await this.userService.delete(+id);
  }
}
