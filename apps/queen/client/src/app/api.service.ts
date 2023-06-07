import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '@whc/queen/model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

    private getHeaders(): { headers: {Authorization: string} } {
        const token = window.localStorage.getItem('token') || '';
        return {
            headers: {
                Authorization: `token ${token}`
            }
        }
    }

    private makeGetRequest<T>(endpoint: string): Observable<T> {
        const headers = this.getHeaders();
        return this.http.get<T>(endpoint, headers);

    }

    getProjects(): Observable<Project[]> {
        return this.makeGetRequest<Project[]>('/api/projects');
    }
}
