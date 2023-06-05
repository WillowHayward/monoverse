import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {

    }
    testRequest(token: string): Observable<string> {
        return this.http.get<string>('/api/repos', {
            headers: {
                Authorization: `token ${token}`
            }
        });
    }
}
