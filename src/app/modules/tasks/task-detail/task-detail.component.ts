import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Observable, pluck, takeUntil } from 'rxjs';
import { Task } from '../shared/models/task.model';

import { BackendService } from 'src/app/backend.service';
import { BaseComponent } from 'src/app/components/base-component/base.component';
import { TASK_KEY } from '../shared/constants/tasks.constant';
import { User } from '../shared/models/user.model';

@Component({
    selector: 'app-task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksDetailComponent extends BaseComponent implements OnInit {
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    selectedUser!: number;
    task!: Task;
    user$!: Observable<User | undefined>;
    userId!: number | undefined;
    userList$!: Observable<User[] | undefined>;
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(
        private activatedRoute: ActivatedRoute,
        private backendService: BackendService,
        private cdRef: ChangeDetectorRef,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        super();
    }

    ngOnInit(): void {
        this.getTaskDetail();
        this.getUserByID();
        this.getUserList();
    }

    goBack(): void {
        this.router.navigate(['../']);
    }

    removeTask(task: Task): void {
        this.backendService.removeTask(task).subscribe(_ => {
            this.openSnackBar('Remove task success');
            this.goBack();
        });
    }

    // TODO: get name instead of id
    changeUser(): void {
        this.backendService.assignTaskToUser(this.task?.id, this.selectedUser).subscribe(data => {
            this.openSnackBar(`Assigned ${this.selectedUser} to this task!`);
            this.goBack();
        });
    }

    private openSnackBar(message: string) {
        this.snackBar.open(message, '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 1000,
        });
    }

    private getUserByID(): void {
        this.user$ = this.backendService.getUserByID(Number(this.task?.assigneeId))
    }

    private getUserList(): void {
        this.userList$ = this.backendService.getUserList();
    }

    private getTaskDetail(): void {
        this.activatedRoute.data.pipe(
            pluck(TASK_KEY),
            takeUntil(this.destroyed$)
        ).subscribe((task: Task) => {
            this.task = task;
            this.cdRef.markForCheck();
        });
    }
}