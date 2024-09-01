import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { UserService } from '../user/user.service';
import { AuthPublic } from '@/common/decorators/public.decorator';
import { LoginUserModel } from './models/auth.model';
import { ApiResult } from '@/common/decorators/api-result.decorator';

@ApiTags('Auth - 认证模块')
@AuthPublic()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiResult({ type: LoginUserModel })
  async userLogin(@Body() dto: LoginUserDto): Promise<LoginUserModel> {
    const response = await this.authService.login(dto);
    return response;
  }

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() dto: RegisterUserDto): Promise<void> {
    await this.userService.register(dto);
  }
}
