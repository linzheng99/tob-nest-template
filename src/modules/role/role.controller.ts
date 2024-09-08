import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto, RoleQueryDto, UpdateRoleDto } from './dto/role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSecurityAuth } from '@/common/decorators/swagger.decorator';

@ApiTags('Role - 角色模块')
@ApiSecurityAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  @ApiOperation({ summary: '创建角色' })
  create(@Body() dto: RoleDto) {
    return this.roleService.create(dto);
  }

  @Get('list')
  @ApiOperation({ summary: '角色列表' })
  list(@Query() dto: RoleQueryDto) {
    return this.roleService.list(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '角色信息' })
  getInfo(@Param('id') id: string) {
    return this.roleService.getInfo(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色信息' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  delete(@Param('id') id: string) {
    return this.roleService.delete(+id);
  }
}
