import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Token = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();

    const token = request['token'];
    return token;
});
