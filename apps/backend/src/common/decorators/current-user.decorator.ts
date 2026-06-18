import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserContext } from '@cinema/types';

export const CurrentUser = createParamDecorator(
  (data: keyof IUserContext | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as IUserContext;
    
    return data ? user?.[data] : user;
  },
);
