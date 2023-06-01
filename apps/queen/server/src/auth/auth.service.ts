import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AuthInitData, AuthTokenRequest, AuthTokenResponse, GiteaTokenResponse } from '@whc/queen/model';
import { map, Observable } from 'rxjs';

const GITEA_SECRET = process.env['GITEA_SECRET'];
const CLIENT_ID = process.env['CLIENT_ID'];
const GITEA_URL = process.env['GITEA_URL'];
const REDIRECT_URI = process.env['REDIRECT_URI'];

@Injectable()
export class AuthService {
    constructor(private http: HttpService) {}

    getInitData(): AuthInitData {
        const state = 'randomstring';
        return {
            id: CLIENT_ID,
            url: GITEA_URL,
            redirect: REDIRECT_URI,
            state
        };
    }

    getToken(state: string, request: AuthTokenRequest): Observable<AuthTokenResponse> {
        return this.http.post<GiteaTokenResponse>(`${GITEA_URL}/login/oauth/access_token`, {
            client_id: CLIENT_ID,
            client_secret: GITEA_SECRET,
            code: request.code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI
        }).pipe(map(response => {
            return {
                token: response.data.access_token
            }
        }));
    }

    getTest(token: string) {
        return this.http.get(`${GITEA_URL}/api/v1/user`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
    }
}
