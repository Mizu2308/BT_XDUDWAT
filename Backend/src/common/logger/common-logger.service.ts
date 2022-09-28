import {Injectable, LoggerService} from '@nestjs/common';
import {LOGGER_LEVEL, LOGGER_SILENT, SERVICE_NAME} from 'configs/configs.constants';
import * as winston from 'winston';

const logFormatDefault = winston.format.combine(
  winston.format.label({label: SERVICE_NAME || 'name_app'}),
  winston.format.timestamp({
    format: 'YYYY-MM-DD,hh:mm:ss sssZ',
  }),
  winston.format.errors({stack: true}),
  winston.format.json({
    space: 0,
  }),
);

export const transportsConsole = new winston.transports.Console({
  format: logFormatDefault,
  level: LOGGER_LEVEL || 'debug',
  silent: (LOGGER_SILENT == 'true' ? true : false) || false,
});

@Injectable()
export class CommonLoggerService implements LoggerService {
  private winston;
  private contextName;
  constructor() {
    // super();
    this.winston = winston.createLogger({
      format: logFormatDefault,
      defaultMeta: {service: this.contextName},
      transports: [transportsConsole],
    });
  }
  setContextName(contextName) {
    this.contextName = contextName;
  }

  // 0
  error(message: any, key?: string) {
    this.winston.log({
      level: 'error',
      message,
      contextName: this.contextName,
      key,
    });
  }

  //1
  warn(message: any, key?: string) {
    this.winston.log({
      level: 'warn',
      message,
      contextName: this.contextName,
      key,
    });
  }

  // 2
  log(message: any, key?: string) {
    this.winston.log({
      level: 'info',
      message,
      contextName: this.contextName,
      key,
    });
  }

  // 2
  info(message: any, key?: string) {
    this.winston.log({
      level: 'info',
      message,
      contextName: this.contextName,
      key,
    });
  }

  // 3
  http(message: any, key?: string) {
    this.winston.log({
      level: 'http',
      message,
      contextName: this.contextName,
      key,
    });
  }

  // 4
  verbose(message: any, key?: string) {
    this.winston.log({
      level: 'verbose',
      message,
      contextName: this.contextName,
      key,
    });
  }

  // 5
  debug(message: any, key?: string) {
    this.winston.log({
      level: 'debug',
      message,
      contextName: this.contextName,
      key,
    });
  }

  // 6
  silly(message: any, key?: string) {
    this.winston.log({
      level: 'silly',
      message,
      contextName: this.contextName,
      key,
    });
  }
}
