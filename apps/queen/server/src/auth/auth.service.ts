import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthInitData, AuthTokenRequest } from '@whc/queen/model';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../api/api.service';

import type { AuthTokenResponse, QueenTokenResponse } from '../types/auth';
import { UsersService } from '../users/users.service';
import { GITEA_URL, GITEA_SECRET, GITEA_CLIENT_ID, GITEA_REDIRECT_URI } from '../constants';


@Injectable()
export class AuthService {
    constructor(private http: HttpService, private users: UsersService, private jwt: JwtService, private api: ApiService) {}

    initAuth(): AuthInitData {
        const state = 'randomstring';
        return {
            id: GITEA_CLIENT_ID,
            url: GITEA_URL,
            redirect: GITEA_REDIRECT_URI,
            state
        };
    }

    async getToken(state: string, request: AuthTokenRequest): Promise<QueenTokenResponse> {
        // Mixing promises and observables got messy - this function will need cleaning up
        const giteaTokenResponse = await firstValueFrom(this.http.post<AuthTokenResponse>(`${GITEA_URL}/login/oauth/access_token`, {
            client_id: GITEA_CLIENT_ID,
            client_secret: GITEA_SECRET,
            code: request.code,
            grant_type: 'authorization_code',
            redirect_uri: GITEA_REDIRECT_URI
        }));
        const auth = giteaTokenResponse.data;
        const giteaUser = await this.api.getUser(auth.access_token);

        let user = await this.users.findUser(giteaUser);
        if (!user) {
            user = await this.users.createUser(giteaUser, auth);
        }

        console.log(user.name, 'logged in');
        const token = this.jwt.sign({
            id: user.gitea_id
        });

        return {
            token
        }
    }
}
