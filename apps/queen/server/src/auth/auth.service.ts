import { Injectable } from '@nestjs/common';
import { AuthInitData, AuthTokenRequest } from '@whc/queen/model';
import { ApiService } from '../api/api.service';

import type { QueenTokenResponse } from '../types/auth';
import { UsersService } from '../users/users.service';
import { QUEEN_TOKEN_LIFESPAN, GITEA_URL, GITEA_CLIENT_ID, GITEA_REDIRECT_URI } from '../constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../entities';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
    constructor(private users: UsersService,
        private api: ApiService,
        @InjectRepository(Session) private sessions: Repository<Session>
    ) {}

    async initAuth(): Promise<AuthInitData> {
        const session = await this.createSession();

        return {
            id: GITEA_CLIENT_ID,
            url: GITEA_URL,
            redirect: GITEA_REDIRECT_URI,
            state: session.state
        };
    }

    async getToken(state: string, request: AuthTokenRequest): Promise<QueenTokenResponse> {
        // Mixing promises and observables got messy - this function will need cleaning up
        const session = await this.sessions.findOneBy({ state });
        if (!session) {
            throw new Error();
        }

        if (session.state !== request.state) {
            throw new Error();
        }

        const auth = await this.api.getToken(request.code);
        const now = (new Date()).valueOf();
        const authExpiry = now + auth.expires_in * 1000;
        const tokenExpiry = now + QUEEN_TOKEN_LIFESPAN;

        session.oauth_access_token = auth.access_token;
        session.oauth_token_expires = authExpiry;
        session.oauth_refresh_token = auth.refresh_token;
        session.token_expiry = tokenExpiry;


        const giteaUser = await this.api.getUser(auth.access_token);

        let user = await this.users.findUser(giteaUser);
        if (!user) {
            user = await this.users.createUser(giteaUser);
        }

        session.user = user.id;

        this.sessions.update(session.id, session);

        console.log(user.name, 'logged in');

        return {
            token: session.token,
            expiry: tokenExpiry
        }
    }

    async createSession(): Promise<Session> {
        let token: string;
        do {
            token = randomBytes(16).toString('hex');
        } while(await this.sessions.findOneBy({ token }))
        
        let state: string;
        do {
            state = randomBytes(16).toString('hex');
        } while(await this.sessions.findOneBy({ state }))

        const session = this.sessions.create({
            token,
            state
        });
        this.sessions.insert(session);

        return session;
    }
}
