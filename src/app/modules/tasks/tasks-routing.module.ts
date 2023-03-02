import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GuardService } from 'src/app/core/services/guard.service';
import { TASK_KEY } from './shared/constants/tasks.constant';
import { TaskResolver } from './shared/resolves/task.resolve';
import { TASKS_ROUTES } from './shared/enums/tasks-routes.enum';
import { TasksComponent } from './tasks.component';
import { TasksDetailComponent } from './task-detail/task-detail.component';

const routes: Routes = [
    {
        path: TASKS_ROUTES.BLANK,
        component: TasksComponent,
        canActivate: [GuardService]
    },
    {
        path: TASKS_ROUTES.DETAILS,
        component: TasksDetailComponent,
        canActivate: [GuardService],
        resolve: {
            [TASK_KEY]: TaskResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaskRoutingModule { }