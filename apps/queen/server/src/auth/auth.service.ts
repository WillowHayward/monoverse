import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthInitData, AuthTokenRequest, AuthTokenResponse } from '@whc/queen/model';
import { map, switchMap, Observable } from 'rxjs';

import type { AccessTokenResponse, UserResponse } from '../gitea.api';
import { UsersService } from '../users/users.service';

const GITEA_SECRET = process.env['QUEEN_GITEA_SECRET'];
const CLIENT_ID = process.env['QUEEN_CLIENT_ID'];
const GITEA_URL = process.env['QUEEN_GITEA_URL'];
const REDIRECT_URI = process.env['QUEEN_REDIRECT_URI'];

@Injectable()
export class AuthService {
    constructor(private http: HttpService, private users: UsersService, private jwt: JwtService) {}

    initAuth(): AuthInitData {
        const state = 'randomstring';
        return {
            id: CLIENT_ID,
            url: GITEA_URL,
            redirect: REDIRECT_URI,
            state
        };
    }

    getToken(state: string, request: AuthTokenRequest): Observable<AuthTokenResponse> {
        return this.http.post<AccessTokenResponse>(`${GITEA_URL}/login/oauth/access_token`, {
            client_id: CLIENT_ID,
            client_secret: GITEA_SECRET,
            code: request.code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI
        }).pipe(switchMap(response => {
            return this.http.get<UserResponse>(`${GITEA_URL}/api/v1/user`, {
                headers: {
                    Authorization: `token ${response.data.access_token}`
                }
            });
        }), map(response => {
            let user = this.users.findUser(response.data.id);
            if (!user) {
                user = this.users.createUser(response.data.id, response.data.full_name);
            }
            if (!user) {
                console.error('Error with auth');
                return { token: '' };
            }

            console.log(user.name, 'logged in');
            const token = this.jwt.sign({
                id: user.gitea_id
            });

            return {
                token
            }
        }));
    }
}
