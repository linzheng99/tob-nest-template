import { SetMetadata } from '@nestjs/common';

import { AUTH_PUBLIC_KEY } from '@/constants';

/**
 * 当接口不需要检测用户登录时添加该装饰器
 */
export const AuthPublic = () => SetMetadata(AUTH_PUBLIC_KEY, true);
