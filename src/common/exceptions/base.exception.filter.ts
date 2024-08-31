import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { BusinessException } from './business.exception';
import { ErrorEnum } from '@/constants/error-code.constant';
import { isDev } from '@/global';

interface myError {
  readonly status: number;
  readonly statusCode?: number;
  readonly message?: string;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const url = request.url!;
    const status = this.getStatus(exception);
    const errorCode =
      exception instanceof BusinessException
        ? exception.getErrorCode()
        : status;

    let message = this.getErrorMessage(exception);

    // 系统内部错误时
    if (
      status === HttpStatus.INTERNAL_SERVER_ERROR &&
      !(exception instanceof BusinessException)
    ) {
      Logger.error(exception, undefined, 'Catch');
      // 生产环境下隐藏错误信息
      if (!isDev) message = ErrorEnum.SERVER_ERROR?.split(':')[1];
    } else {
      this.logger.warn(
        `错误信息：(${status}) ${message} Path: ${decodeURI(url)}`,
      );
    }

    response.status(status).send({
      code: errorCode,
      data: null,
      message: message,
    });
  }

  getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      return (
        (exception as myError)?.status ??
        (exception as myError)?.statusCode ??
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.message;
    } else if (exception instanceof QueryFailedError) {
      return exception.message;
    } else {
      return (
        (exception as any)?.response?.message ??
        (exception as myError)?.message ??
        `${exception}`
      );
    }
  }
}
