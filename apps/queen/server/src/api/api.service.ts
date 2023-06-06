import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as Gitea from '../types/gitea';
import { AuthTokenResponse } from '../types/auth';
import { GITEA_URL, GITEA_SECRET, GITEA_CLIENT_ID, GITEA_REDIRECT_URI } from '../constants';


@Injectable()
export class ApiService {
    constructor(private http: HttpService) {}

    async getToken(code: string): Promise<AuthTokenResponse> {
        const giteaTokenResponse = await firstValueFrom(this.http.post<AuthTokenResponse>(`${GITEA_URL}/login/oauth/access_token`, {
            client_id: GITEA_CLIENT_ID,
            client_secret: GITEA_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: GITEA_REDIRECT_URI
        }));

        return giteaTokenResponse.data;
    }

    async refreshToken(refreshToken: string): Promise<AuthTokenResponse> {
        const giteaTokenResponse = await firstValueFrom(this.http.post<AuthTokenResponse>(`${GITEA_URL}/login/oauth/access_token`, {
            client_id: GITEA_CLIENT_ID,
            client_secret: GITEA_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            redirect_uri: GITEA_REDIRECT_URI
        }));

        return giteaTokenResponse.data;
    }

    async getUser(token: string): Promise<Gitea.User> {
        return this.makeGetRequest<Gitea.User>('/user', token);
    }

    async getRepos(token: string): Promise<Gitea.Repository[]> {
        return this.makeGetRequest<Gitea.Repository[]>(`user/repos`, token);
    }

    private async makeGetRequest<T>(endpoint: string, token: string): Promise<T> {
        const request = this.http.get<T>(`${GITEA_URL}/api/v1/${endpoint}`, {
            headers: {
                Authorization: `token ${token}`
            }
        });

        const response = await firstValueFrom(request);
        return response.data;
    }

    private async makePostRequest<T>(endpoint: string, token: string, body: any): Promise<T> {
        const request = this.http.post<T>(`${GITEA_URL}/api/v1/${endpoint}`, body, {
            headers: {
                Authorization: `token ${token}`
            }
        });

        const response = await firstValueFrom(request);
        return response.data;
    }
}
