export enum ErrorEnum {
  DEFAULT = '0:未知错误',
  SERVER_ERROR = '500:服务繁忙，请稍后再试',

  SYSTEM_USER_EXISTS = '1001:系统用户已存在',
  INVALID_VERIFICATION_CODE = '1002:验证码填写有误',
  INVALID_USERNAME_PASSWORD = '1003:用户名密码有误',
  USER_NOT_FOUND = '1004:用户不存在',

  INVALID_LOGIN = '1101:登录无效，请重新登录',
}
