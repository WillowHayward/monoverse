import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as Gitea from '../types/gitea';

const GITEA_URL = process.env['QUEEN_GITEA_URL'];

@Injectable()
export class ApiService {
    constructor(private http: HttpService) {}

    async getUser(token: string): Promise<Gitea.User> {
        return this.makeGetRequest<Gitea.User>('/user', token);
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
}
