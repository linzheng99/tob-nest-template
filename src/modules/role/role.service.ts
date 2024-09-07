import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleDto, RoleQueryDto, UpdateRoleDto } from './dto/role.dto';
import { paginate, Pagination } from '@/helper/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async create(role: RoleDto) {
    return await this.roleRepository.save(role);
  }

  list({
    page,
    pageSize,
    name,
  }: RoleQueryDto): Promise<Pagination<RoleEntity>> {
    const queryBuilder = this.roleRepository.createQueryBuilder().where({
      ...(name ? { username: Like(`%${name}%`) } : null),
    });

    return paginate<RoleEntity>(queryBuilder, {
      page,
      pageSize,
    });
  }

  getInfo(id: number) {
    return `This action returns a #${id} role`;
  }

  async update(id: number, dto: UpdateRoleDto) {
    const existingUser = await this.roleRepository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException('未找到指定 ID 的角色');
    }
    const user = await this.roleRepository.update(id, dto);
    return user;
  }

  async delete(id: number) {
    await this.roleRepository.delete(id);
    return 'success';
  }
}
