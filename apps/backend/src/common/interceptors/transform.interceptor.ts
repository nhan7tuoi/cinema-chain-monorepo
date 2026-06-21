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

    // Use "success" or statusCode based on HTTP code if needed. We will return "success" if 200/201.
    // The user just requested "status", we'll provide the HTTP statusCode like 200, 201 to be robust.
    const statusVal = statusCode >= 200 && statusCode < 300 ? 'success' : 'error';

    return next.handle().pipe(
      map(data => {
        // If data is null or undefined
        if (data === undefined || data === null) {
          return { status: statusVal, statusCode };
        }

        // If data is an array or primitive
        if (typeof data !== 'object' || Array.isArray(data)) {
          return { status: statusVal, statusCode, data };
        }

        // If data is already an object, just merge the status into it
        // This handles PageDto { data, meta } by adding status: 'success' next to data
        // Also handles { accessToken, refreshToken } without breaking current frontend
        return {
          status: statusVal,
          statusCode,
          ...data,
        };
      }),
    );
  }
}
