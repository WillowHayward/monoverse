import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Session } from './entities';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(Session)
        private sessions: Repository<Session>,
    ) {}

    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        const session = await this.sessions.findOneBy({ token });

        if (!session) {
            throw new UnauthorizedException();
        }


        const now = (new Date()).valueOf();
        if (now > session.token_expiry) {
            throw new Error('Token Expired');
        }

        request['token'] = session.oauth_access_token;

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers?.authorization.split(' ') || [];

        if (type !== 'token') {
            return undefined;
        }

        return token;
    }
}
