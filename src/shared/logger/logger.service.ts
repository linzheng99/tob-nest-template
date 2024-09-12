import { ConfigKeyPaths } from '@/config';
import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Logger as WinstonLogger } from 'winston';
import { config, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file'; // 导入Winston的每日轮换文件传输

// 定义日志级别的枚举
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

@Injectable({})
export class LoggerService extends ConsoleLogger {
  private winstonLogger: WinstonLogger;

  constructor(
    context: string,
    options: ConsoleLoggerOptions,
    private configService: ConfigService<ConfigKeyPaths>,
  ) {
    // 调用父类构造函数
    super(context, options);
    this.initWinston();
  }

  // 获取当前日志级别
  protected get level(): LogLevel {
    return this.configService.get('app.logger.level', {
      infer: true,
    }) as LogLevel;
  }

  // 获取最大文件数
  protected get maxFiles(): number {
    return this.configService.get('app.logger.maxFiles', { infer: true });
  }

  // 初始化Winston日志记录器
  protected initWinston(): void {
    this.winstonLogger = createLogger({
      // 设置日志级别
      levels: config.npm.levels,
      // 设置日志格式
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json(),
      ),
      // 设置传输方式
      transports: [
        // 每日轮换文件传输
        new transports.DailyRotateFile({
          // 级别
          level: this.level,
          // 日志文件名
          filename: 'logs/app.%DATE%.log',
          // 日期模式
          datePattern: 'YYYY-MM-DD',
          // 最大文件数
          maxFiles: this.maxFiles,
          // 日志格式
          format: format.combine(format.timestamp(), format.json()),
          // 审计文件
          auditFile: 'logs/.audit/app.json',
        }),
        // 每日轮换文件传输（错误日志）
        new transports.DailyRotateFile({
          level: LogLevel.ERROR,
          filename: 'logs/app-error.%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: this.maxFiles,
          format: format.combine(format.timestamp(), format.json()),
          auditFile: 'logs/.audit/app-error.json',
        }),
      ],
    });
  }

  // 记录详细日志
  verbose(message: any, context?: string): void {
    super.verbose.apply(this, [message, context]);
    this.winstonLogger.log(LogLevel.VERBOSE, message, { context });
  }

  // 记录调试日志
  debug(message: any, context?: string): void {
    super.debug.apply(this, [message, context]);
    this.winstonLogger.log(LogLevel.DEBUG, message, { context });
  }

  // 记录信息日志
  log(message: any, context?: string): void {
    super.log.apply(this, [message, context]);
    this.winstonLogger.log(LogLevel.INFO, message, { context });
  }

  // 记录警告日志
  warn(message: any, context?: string): void {
    super.warn.apply(this, [message, context]);
    this.winstonLogger.log(LogLevel.WARN, message);
  }

  // 记录错误日志
  error(message: any, stack?: string, context?: string): void {
    super.error.apply(this, [message, stack, context]);

    const hasStack = !!context; // 检查是否有堆栈信息
    this.winstonLogger.log(LogLevel.ERROR, {
      // 使用Winston记录错误日志
      context: hasStack ? context : stack, // 设置上下文
      message: hasStack ? new Error(message) : message, // 设置消息
    });
  }
}
