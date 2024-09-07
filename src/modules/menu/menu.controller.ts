import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSecurityAuth } from '@/common/decorators/swagger.decorator';
import { MenuDto, MenuUpdateDto } from './dto/menu.dto';
import { CreatorPipe } from '@/common/pipes/creator.pipe';
import { UpdaterPipe } from '@/common/pipes/updater.pipe';
import { ApiResult } from '@/common/decorators/api-result.decorator';
import { MenuItemInfo } from './models/menu.model';

@ApiTags('Menu - 菜单管理')
@ApiSecurityAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('create')
  @ApiOperation({ summary: '创建菜单' })
  create(@Body(CreatorPipe) dto: MenuDto) {
    return this.menuService.create(dto);
  }

  @Get('list')
  @ApiOperation({ summary: '所有菜单列表' })
  @ApiResult({ type: [MenuItemInfo] })
  list() {
    return this.menuService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: '菜单信息' })
  @ApiResult({ type: MenuItemInfo })
  menuInfo(@Param('id') id: string) {
    return this.menuService.getMenuInfo(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新菜单' })
  update(@Param('id') id: string, @Body(UpdaterPipe) dto: MenuUpdateDto) {
    return this.menuService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
