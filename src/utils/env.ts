import { ForbiddenException } from '@nestjs/common';

// 获取环境变量
export const getEnvString = (key: string) => {
  return process.env[key];
};

export const getEnvNumber = (key: string) => {
  return Number(process.env[key]);
};

export const getEnvBoolean = (key: string) => {
  return Boolean(process.env[key]);
};

// 检查是否是演示环境
export function checkIsDemoMode() {
  if (getEnvBoolean('IS_DEMO'))
    throw new ForbiddenException('演示模式下不允许操作');
}
