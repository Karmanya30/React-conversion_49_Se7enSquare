import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRecord } from '../utils/in-memory-db';

export const CurrentUser = createParamDecorator(
  (data: keyof UserRecord | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return null;
    return data ? user[data] : user;
  },
);
