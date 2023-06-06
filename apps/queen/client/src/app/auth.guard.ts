import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const token = window.localStorage.getItem('token');
        const expiry = Number.parseInt(window.localStorage.getItem('tokenExpiry') || '0');

        const valid = this.validateToken(token, expiry);

        if (!valid) {
            this.router.navigate(['/login']);
            return false;
        }

        return true;
  }

    private validateToken(token: string | null, expiry: number): boolean {
        if (!token || !expiry) {
            return false;
        }

        const now = (new Date()).valueOf();

        if (expiry < now) {
            return false;
        }

        return true;
    }
  
}
