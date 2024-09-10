import { PERMISSION_KEY } from '@/constants';
import { applyDecorators, SetMetadata } from '@nestjs/common';

/** 需要特定的权限 */
export function Perm(permission: string | string[]) {
  return applyDecorators(SetMetadata(PERMISSION_KEY, permission));
}
