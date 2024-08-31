import { RedisKeys } from '@/constants/cache.constant';

/** 生成 auth token redis key */
export function genAuthTokenKey(val: string | number) {
  return `${RedisKeys.AUTH_TOKEN_PREFIX}${String(val)}` as const;
}
/** 生成 token blacklist redis key */
export function genTokenBlacklistKey(tokenId: string) {
  return `${RedisKeys.TOKEN_BLACKLIST_PREFIX}${String(tokenId)}` as const;
}
