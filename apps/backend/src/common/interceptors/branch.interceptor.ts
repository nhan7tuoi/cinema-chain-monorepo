import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BranchInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const branchId = request.headers['x-branch-id'];

    if (branchId) {
      if (request.method === 'GET') {
        request.query.branchId = branchId;
      } else if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        if (!request.body) request.body = {};
        request.body.branchId = branchId;
      }
    }

    return next.handle();
  }
}
