import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: number | string;
  data?: T;
  [key: string]: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    const statusVal = statusCode >= 200 && statusCode < 300 ? 'success' : 'error';

    return next.handle().pipe(
      map(data => {
        if (data === undefined || data === null) {
          return { status: statusVal, statusCode };
        }

        if (typeof data !== 'object' || Array.isArray(data)) {
          return { status: statusVal, statusCode, data };
        }

        return {
          status: statusVal,
          statusCode,
          ...data,
        };
      }),
    );
  }
}
