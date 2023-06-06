import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Session } from './entities';
import { ApiService } from './api/api.service';

//TODO: Make this global?

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(Session)
        private sessions: Repository<Session>,
        private api: ApiService
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

        if (now > session.oauth_token_expires) {
            await this.updateToken(session);
        }

        request['session'] = session;

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers?.authorization.split(' ') || [];

        if (type !== 'token') {
            return undefined;
        }

        return token;
    }

    private async updateToken(session: Session) {
        const token = await this.api.refreshToken(session.oauth_refresh_token);

        const now = (new Date()).valueOf();
        const authExpiry = now + token.expires_in * 1000;

        session.oauth_access_token = token.access_token;
        session.oauth_refresh_token = token.refresh_token;
        session.oauth_token_expires = authExpiry;

        this.sessions.update(session.id, session);
    }
}
