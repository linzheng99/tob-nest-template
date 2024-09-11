import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { md5 } from '@/utils';
import { EntityManager, In, Like, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ErrorEnum } from '@/constants/error-code.constant';
import { JwtUserData } from '../auth/guards/jwt-auth.guard';
import { IJWtConfig, JwtConfig } from '@/config';
import { RedisService } from '@/shared/redis/redis.service';
import { genAuthTokenKey, genTokenBlacklistKey } from '@/utils/redis';
import { UserDto, UserQueryDto } from './dto/user.dto';
import { paginate, Pagination } from '@/helper/pagination';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEntity } from '../role/entities/role.entity';
import { ROOT_USER_ID } from '@/constants/system.constat';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
    @Inject(JwtConfig.KEY)
    private jwtConfig: IJWtConfig,
    private redisService: RedisService,
  ) {}

  async userExists(username: string): Promise<boolean> {
    const exists = await this.userRepository.findOneBy({ username });
    return !!exists;
  }

  async register({ username, ...data }: RegisterUserDto): Promise<void> {
    if (await this.userExists(username)) {
      throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);
    }

    await this.entityManager.transaction(async (manager) => {
      const u = manager.create(UserEntity, {
        username,
        password: md5(data.password),
        ...data,
      });

      const user = await manager.save(u);

      return user;
    });
  }

  async create({
    username,
    password,
    roleIds,
    ...data
  }: UserDto): Promise<void> {
    if (await this.userExists(username)) {
      throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);
    }

    await this.entityManager.transaction(async (manager) => {
      const u = manager.create(UserEntity, {
        username,
        password: md5(password),
        ...data,
        roles: await this.roleRepository.findBy({ id: In(roleIds) }),
      });

      const result = await manager.save(u);
      return result;
    });
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
    // 不能删除 root 用户
    if (id === ROOT_USER_ID)
      throw new BadRequestException('不能删除 root 用户!');

    // 删除与角色相关的用户角色
    await this.entityManager.delete('user_roles', { role_id: id });

    await this.userRepository.delete(id);
    return 'success';
  }

  async findUserByUserName(username: string) {
    return await this.userRepository.findOne({
      where: {
        username,
      },
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
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.id = :id', { id })
      .getOne();

    if (user) {
      delete user.password;
    }

    return {
      ...user,
      roleIds: user.roles?.map((r) => r.id),
    };
  }

  async updateUser(id: number, { roleIds, ...data }: UpdateUserDto) {
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException('未找到指定 ID 的用户');
    }

    await this.entityManager.transaction(async (manager) => {
      await manager.update(UserEntity, id, {
        ...data,
      });

      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'roles')
        .where('user.id = :id', { id })
        .getOne();

      if (roleIds) {
        await manager
          .createQueryBuilder()
          .relation(UserEntity, 'roles')
          .of(id)
          .addAndRemove(roleIds, user.roles);
      }
    });
  }
}
