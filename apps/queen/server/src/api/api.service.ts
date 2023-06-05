import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as Gitea from '../types/gitea';
import { GITEA_URL } from '../constants';


@Injectable()
export class ApiService {
    constructor(private http: HttpService) {}

    async getUser(token: string): Promise<Gitea.User> {
        return this.makeGetRequest<Gitea.User>('/user', token);
    }

    async getUserRepos(username: string, token: string): Promise<Gitea.Repository[]> {
        return this.makeGetRequest<Gitea.Repository[]>(`/users/${username}/repos`, token);
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
