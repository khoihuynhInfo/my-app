import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class GuardService implements CanActivate {
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return of(true)
    }
}