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
