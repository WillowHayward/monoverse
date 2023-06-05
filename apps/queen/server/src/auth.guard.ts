import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities';
import { QUEEN_SECRET } from './constants';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwt: JwtService,
    ) {}

    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            this.jwt.verify(token, {
                secret: QUEEN_SECRET
            });
        } catch (err) {
            throw new UnauthorizedException('Invalid Token');
        }

        const payload = this.jwt.decode(token);
        const oauthToken = await this.getApiToken(payload['id']);
        request['token'] = oauthToken;

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers?.authorization.split(' ') || [];

        if (type !== 'token') {
            return undefined;
        }

        return token;
    }

    private async getApiToken(userId: number): Promise<string> {
        const user: User = await this.usersRepository.findOneBy({
            gitea_id: userId
            }
        );

        const now = (new Date()).valueOf();
        if (now < user.oauth_token_expires) {
            // TODO: Refresh token
        }

        return user.oauth_access_token;
    }
}
