import { Injectable } from '@nestjs/common';
import { MenuDto, MenuUpdateDto } from './dto/menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { buildMenuTree } from '@/helper/menu';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
  ) {}

  async list() {
    const menus = await this.menuRepository.find();
    return buildMenuTree(menus);
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
