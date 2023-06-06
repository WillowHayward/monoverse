import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Session } from '../entities';

export const Token = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();

    const session: Session = request['session'];
    return session.oauth_access_token;
});
