import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';

@ApiTags('user - 用户模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  async delete(@Param('id') id: number) {
    return await this.userService.delete(+id);
  }
}
