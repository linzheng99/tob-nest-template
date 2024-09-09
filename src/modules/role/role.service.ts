import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleDto, RoleQueryDto, UpdateRoleDto } from './dto/role.dto';
import { paginate, Pagination } from '@/helper/pagination';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { EntityManager, In, Like, Repository } from 'typeorm';
import { MenuEntity } from '../menu/entities/menu.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async create({ menuIds, ...data }: RoleDto): Promise<{ roleId: number }> {
    const role = await this.roleRepository.save({
      ...data,
      menus: menuIds
        ? await this.menuRepository.findBy({ id: In(menuIds) })
        : [],
    });

    return { roleId: role.id };
  }

  list({
    page,
    pageSize,
    name,
  }: RoleQueryDto): Promise<Pagination<RoleEntity>> {
    const queryBuilder = this.roleRepository.createQueryBuilder().where({
      ...(name ? { name: Like(`%${name}%`) } : null),
    });

    return paginate<RoleEntity>(queryBuilder, {
      page,
      pageSize,
    });
  }

  async getAllRoles() {
    return await this.roleRepository.find();
  }

  async getInfo(id: number) {
    const info = await this.roleRepository.findOneBy({ id });

    if (!info) {
      throw new NotFoundException('未找到指定 ID 角色');
    }

    const menus = await this.menuRepository.find({
      where: { roles: { id } },
      select: ['id'],
    });

    return { ...info, menuIds: menus.map((m) => m.id) };
  }

  /**
   * 更新角色信息
   * 如果传入的menuIds为空，则清空sys_role_menus表中存有的关联数据，参考新增
   */
  async update(id: number, { menuIds, ...data }: UpdateRoleDto): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException('未找到指定 ID 角色');
    }

    await this.roleRepository.update(id, data);

    await this.entityManager.transaction(async (manager) => {
      role.menus = menuIds?.length
        ? await this.menuRepository.findBy({ id: In(menuIds) })
        : [];
      await manager.save(role);
    });
  }

  async delete(id: number) {
    await this.roleRepository.delete(id);
    return 'success';
  }

  /**
   * 根据用户id查找角色信息
   */
  async getRoleIdsByUser(id: number): Promise<number[]> {
    const roles = await this.roleRepository.find({
      where: {
        users: { id },
      },
    });

    if (roles) return roles.map((r) => r.id);

    return [];
  }
}
