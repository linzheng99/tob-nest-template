import { Injectable } from '@nestjs/common';
import { MenuDto, MenuUpdateDto } from './dto/menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { buildMenuTree } from '@/helper/menu';
import { RoleService } from '../role/role.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    private roleService: RoleService,
  ) {}

  async getMenuInfo(id: number) {
    const menu = await this.menuRepository.findOneBy({ id });
    return menu;
  }

  async list(): Promise<MenuEntity[]> {
    const menus = await this.menuRepository.find();
    return buildMenuTree(menus);
  }

  async getMenus(id: number) {
    const roleIds = await this.roleService.getRoleIdsByUser(id);
    if (!roleIds.length) {
      return [];
    }
    const menus = await this.getMenusOfRole(roleIds);

    return buildMenuTree(menus);
  }

  /**
   * 获取菜单中的权限
   */
  async getMenusOfPermission(id: number) {
    const roleIds = await this.roleService.getRoleIdsByUser(id);
    if (!roleIds.length) {
      return [];
    }
    const menus = await this.getMenusOfRole(roleIds);
    const permissions = menus
      .filter((m) => m.permission)
      .map((i) => i.permission);

    return permissions;
  }

  /**
   * 用户当前角色的菜单
   */
  async getMenusOfRole(roleIds: number[]) {
    let menus: MenuEntity[] = [];

    menus = await this.menuRepository
      .createQueryBuilder('menu')
      .innerJoinAndSelect('menu.roles', 'role')
      .andWhere('role.id IN (:...roleIds)', { roleIds })
      .getMany();

    return menus;
  }

  async create(menu: MenuDto) {
    return await this.menuRepository.save(menu);
  }

  async update(id: number, menu: MenuUpdateDto) {
    const existingMenu = await this.menuRepository.findOne({ where: { id } });
    if (!existingMenu) {
      throw new NotFoundException('未找到指定 ID 的菜单');
    }

    await this.menuRepository.update(id, menu);
  }

  async remove(id: number) {
    const menuToRemove = await this.menuRepository.findOne({ where: { id } });
    if (!menuToRemove) {
      throw new NotFoundException(`菜单 ID: ${id} 不存在`);
    }
    await this.menuRepository.remove(menuToRemove);
  }
}
