import { RedisKeys } from '@/constants/cache.constant';

/** 生成 auth token redis key */
export function genAuthTokenKey(val: string | number) {
  return `${RedisKeys.AUTH_TOKEN_PREFIX}${String(val)}` as const;
}
