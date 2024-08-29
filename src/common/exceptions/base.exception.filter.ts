import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const errorCode = this.getStatus(exception);
    const errorMessage = this.getErrorMessage(exception);
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.log(exception, request.url);

    // 非 HTTP 标准异常的处理。
    response.status(HttpStatus.SERVICE_UNAVAILABLE).send({
      code: errorCode,
      data: null,
      message: errorMessage,
    });
  }

  getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      // 非 HTTP 标准异常的处理。
      return HttpStatus.SERVICE_UNAVAILABLE;
    }
  }

  getErrorMessage(exception: unknown): string | object {
    if (exception instanceof HttpException) {
      return exception.message;
    } else if (exception instanceof QueryFailedError) {
      return exception.message;
    } else {
      return new ServiceUnavailableException().getResponse();
    }
  }
}
