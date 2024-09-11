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
import { RoleInfo } from './models/role.model';
import { ApiResult } from '@/common/decorators/api-result.decorator';
import { RoleEntity } from './entities/role.entity';
import { definePermission } from '@/helper/permission';
import { Perm } from '@/common/decorators/permission.decorator';

export const permissions = definePermission('system:role', {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
} as const);

@ApiTags('Role - 角色模块')
@ApiSecurityAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('all')
  @ApiOperation({ summary: '全部角色' })
  @ApiResult({ type: [RoleEntity], isPage: false })
  allRoles() {
    return this.roleService.getAllRoles();
  }

  @Post('create')
  @ApiOperation({ summary: '创建角色' })
  @Perm(permissions.CREATE)
  create(@Body() dto: RoleDto) {
    return this.roleService.create(dto);
  }

  @Get('list')
  @ApiOperation({ summary: '角色列表' })
  @ApiResult({ type: [RoleEntity] })
  list(@Query() dto: RoleQueryDto) {
    return this.roleService.list(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '角色信息' })
  @ApiResult({ type: RoleInfo })
  getInfo(@Param('id') id: string) {
    return this.roleService.getInfo(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色信息' })
  @Perm(permissions.UPDATE)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  @Perm(permissions.DELETE)
  delete(@Param('id') id: string) {
    // TODO 关联用户无法删除
    return this.roleService.delete(+id);
  }
}
