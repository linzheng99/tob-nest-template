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
import { ApiTags } from '@nestjs/swagger';
import { ApiSecurityAuth } from '@/common/decorators/swagger.decorator';
import { MenuDto, MenuUpdateDto } from './dto/menu.dto';
import { CreatorPipe } from '@/common/pipes/creator.pipe';
import { UpdaterPipe } from '@/common/pipes/updater.pipe';

@ApiTags('Menu - 菜单管理')
@ApiSecurityAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('create')
  create(@Body(CreatorPipe) dto: MenuDto) {
    return this.menuService.create(dto);
  }

  @Get('list')
  list() {
    return this.menuService.list();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body(UpdaterPipe) dto: MenuUpdateDto) {
    console.log('id', id);
    return this.menuService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
