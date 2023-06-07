import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { SessionEntity } from '../entities';

export const Token = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();

    const session: SessionEntity = request['session'];
    return session.oauth_access_token;
});
