import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { md5 } from '@/utils';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ErrorEnum } from '@/constants/error-code.constant';
import { JwtUserData } from '../auth/guards/jwt-auth.guard';
import { IJWtConfig, JwtConfig } from '@/config';
import { RedisService } from '@/shared/redis/redis.service';
import { genAuthTokenKey, genTokenBlacklistKey } from '@/utils/redis';
import { UserQueryDto } from './dto/user.dto';
import { paginate, Pagination } from '@/helper/pagination';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(JwtConfig.KEY)
    private jwtConfig: IJWtConfig,
    private redisService: RedisService,
  ) {}

  async register(dto: RegisterUserDto) {
    const exists = await this.userRepository.findOneBy({
      username: dto.username,
    });

    if (exists) throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);

    const user = new UserEntity();
    user.username = dto.username;
    user.password = md5(dto.password);
    user.nickName = dto.nickName || '';
    user.email = dto.email;

    this.userRepository.save(user);
    return 'success';
  }

  async logout(user: JwtUserData, accessToken: string) {
    const exp = user.exp
      ? +(user.exp - Date.now() / 1000).toFixed(0)
      : this.jwtConfig.jwtExpires;

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
    return await this.userRepository.findOne({
      where: {
        username,
      },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async list({
    page,
    pageSize,
    username,
    nickName,
    email,
  }: UserQueryDto): Promise<Pagination<UserEntity>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.nickName',
        'user.email',
        'user.isFrozen',
        'user.createTime',
        'user.updateTime',
      ])
      .where({
        ...(username ? { username: Like(`%${username}%`) } : null),
        ...(nickName ? { nickName: Like(`%${nickName}%`) } : null),
        ...(email ? { email: Like(`%${email}%`) } : null),
      });

    return paginate<UserEntity>(queryBuilder, {
      page,
      pageSize,
    });
  }

  async getUserInfo(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      delete user.password;
    }
    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException('未找到指定 ID 的用户');
    }
    const user = await this.userRepository.update(id, dto);
    return user;
  }
}
