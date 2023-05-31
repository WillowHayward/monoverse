import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AuthInitData, AuthTokenRequest, AuthTokenResponse, GiteaTokenResponse } from '@whc/queen/model';
import { map, Observable } from 'rxjs';

const GITEA_SECRET = 'gto_iqkslhwxmruzactdaqymug7m6u6lys6vacbny5y4enjsx55s5zsa';
const CLIENT_ID = '24763947-1374-442d-aa1e-e918c743313f';
const GITEA_URL = 'https://git.whc.local';
const REDIRECT_URI = 'http://localhost:4200/authorize';

@Injectable()
export class AppService {
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

            console.log(response.data);
            return {
                token: response.data.access_token
            }
        }));
    }
}
