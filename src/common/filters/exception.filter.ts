import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common';
import {CommonLoggerService} from '../logger/common-logger.service';

@Catch()
export class MyExceptionFilter<T> implements ExceptionFilter {
  constructor(private readonly logger: CommonLoggerService) {}

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception.toString(), 'ExceptionFilter');
    }

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message
        : 'Internal Server Error';

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
