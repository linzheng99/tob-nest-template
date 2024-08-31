import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { md5 } from '@/utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ErrorEnum } from '@/constants/error-code.constant';
import { JwtUserData } from '../auth/guards/jwt-auth.guard';
import { IJWtConfig, JwtConfig } from '@/config';
import { RedisService } from '@/shared/redis/redis.service';
import { genAuthTokenKey, genTokenBlacklistKey } from '@/utils/redis';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(JwtConfig.KEY)
    private jwtConfig: IJWtConfig,
    private redisService: RedisService,
  ) {}

  async register(dto: RegisterUserDto) {
    const exists = await this.userRepository.findOneBy({
      username: dto.username,
    });

    if (exists) throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);

    const user = new User();
    user.username = dto.username;
    user.password = md5(dto.password);
    user.nickName = dto.nickName;
    user.email = dto.email;

    this.userRepository.save(user);
    return 'success';
  }

  async logout(user: JwtUserData, accessToken: string) {
    const exp = user.exp
      ? +(user.exp - Date.now() / 1000).toFixed(0)
      : this.jwtConfig.jwtExpires;

    const token = await this.redisService.get(genAuthTokenKey(user.userId));
    console.log(token);

    await this.redisService.set(
      genTokenBlacklistKey(accessToken),
      accessToken,
      exp,
    );
    await this.redisService.del(genAuthTokenKey(user.userId));

    return 'success';
  }

  async delete(id: number) {
    await this.userRepository.delete(id);
    return 'success';
  }

  async findUserByUserName(username: string) {
    console.log(username);

    return await this.userRepository.findOne({
      where: {
        username,
      },
      relations: ['roles', 'roles.permissions'],
    });
  }
}
