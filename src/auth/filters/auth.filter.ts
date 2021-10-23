import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

export type ErrorHttp = Error | string | string[] | undefined;

@Catch()
export class AuthFilter implements ExceptionFilter {
  public catch(error: Error | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let errorMsg: ErrorHttp = error.response?.message || error.message;
    if (Array.isArray(errorMsg)) {
      errorMsg = errorMsg.join(', ');
    }

    response.status(401).json({
      statusCode: 401,
      error: errorMsg || 'Internal server error',
    });
  }
}
