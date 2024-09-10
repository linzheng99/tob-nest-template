import { AUTH_PUBLIC_KEY, PERMISSION_KEY } from '@/constants';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ErrorEnum } from '@/constants/error-code.constant';
import { MenuService } from '@/modules/menu/menu.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private menuService: MenuService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AUTH_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 无需校验
    if (isPublic) return true;

    const { user } = request;
    if (!user) throw new BusinessException(ErrorEnum.INVALID_LOGIN);

    // 查找用户权限
    const userPermission = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    // 没设置接口权限，默认通过
    if (!userPermission.length || !userPermission) return true;
    // TODO 超管放开权限

    // TODO 获取当前用户全部权限
    const allPermissions = await this.menuService.getMenusOfPermission(
      user.userId,
    );
    let isPass = false;

    isPass = userPermission.every((i) => allPermissions.includes(i));
    if (!isPass) throw new BusinessException(ErrorEnum.NO_PERMISSION);

    return true;
  }
}
