import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthInitData, AuthTokenResponse } from '@whc/queen/model';

const QUEEN_SERVER = 'http://localhost:3333/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient ) { }

    getAuthUrl(): Observable<string> {
        return this.http.get<AuthInitData>(QUEEN_SERVER).pipe(map(data => {
            const params = new HttpParams({
                fromObject: {
                    client_id: data.id,
                    redirect_uri: data.redirect,
                    response_type: 'code',
                    state: data.state
                }
            });

            return `${data.url}/login/oauth/authorize?${params.toString()}`;
        }));
    }

    getToken(state: string, code: string): Observable<string> {
        return this.http.post<AuthTokenResponse>(QUEEN_SERVER, {
            state,
            code
        }).pipe(map(data => {
            return data.token;
        }));
    }

    testRequest(token: string) {
        this.http.get('https://git.whc.local/api/v1/user/repos', {
            headers: {
                'Authorization': `token ${token}`
            }
        }).subscribe(resp => {
            console.log(resp);
        });

    }
}
