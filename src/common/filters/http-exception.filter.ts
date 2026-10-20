import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

/**
 * Global HTTP Exception Filter.
 * Catches all HttpExceptions and normalizes error responses into a consistent JSON schema.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse();
    let message: string | string[] = exception.message;
    let error = exception.name;

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const resp = exceptionResponse as { message?: string | string[]; error?: string };
      message = resp.message ?? message;
      error = resp.error ?? error;
    }

    const errorPayload = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
    };

    this.logger.warn(
      `[${request.method}] ${request.url} - Status ${status} - ${JSON.stringify(message)}`,
    );

    response.status(status).json(errorPayload);
  }
}

