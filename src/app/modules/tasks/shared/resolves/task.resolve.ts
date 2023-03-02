import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BackendService } from 'src/app/backend.service';
import { Task } from '../models/task.model';

@Injectable()
export class TaskResolver implements Resolve<Task | undefined> {
    constructor(private backendService: BackendService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task | undefined> {
        return this.backendService.getTaskDetail(Number(route.paramMap.get('id')));
    }
}