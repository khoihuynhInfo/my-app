import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { debounceTime, filter, finalize, switchMap, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { AddFormTaskComponent } from './add-form-task/add-form-task.component';
import { BackendService } from 'src/app/backend.service';
import { BaseComponent } from 'src/app/components/base-component/base.component';
import { Task } from './shared/models/task.model';
import { TASK_STATUS } from './shared/enums/task-staus.enum';
import { TasksHelper } from './shared/helpers/tasks.helper';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss']
})
export class TasksComponent extends BaseComponent implements OnInit {
    done!: Task[];
    horizontalPosition: MatSnackBarHorizontalPosition = 'start'
    inprocess!: Task[];
    isLoading = false;
    searchTaskFormControl = new FormControl();
    todo!: Task[];
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(
        private backendService: BackendService,
        private dialog: MatDialog,
        private matSnackBar: MatSnackBar
    ) {
        super();
    }

    ngOnInit(): void {
        this.getTaskList();
        this.searchTaskFormControlValueChanges();
    }

    drop(event: CdkDragDrop<any>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }

        this.updateTasksStatus();
    }

    trackByID(_: number, task: Task): number {
        return task.id;
    }

    searchTaskFormControlValueChanges(): void {
        this.searchTaskFormControl.valueChanges.pipe(
            debounceTime(100),
            switchMap((taskId: string) => {
                return taskId ? this.backendService.getTaskListById(taskId) : this.backendService.getTaskList();
            })
        ).subscribe(tasks => {
            this.initTaskBaseStatus(tasks)
        });
    }

    // TODO: optimize magic number height and width
    createANewTask(): void {
        const dialogRef = this.dialog.open(AddFormTaskComponent, {
            height: '400px',
            width: '600px'
        });

        dialogRef.afterClosed().pipe(
            filter( isSuccess => isSuccess )
        ).subscribe( () => {
            this.getTaskList();
            this.openSnackBar( 'Add new Task success' );
        } );
    }

    private updateTasksStatus() {
        const todoList = TasksHelper.changeStatusTask(this.todo, TASK_STATUS.TODO);
        const inprocesList = TasksHelper.changeStatusTask(this.inprocess, TASK_STATUS.PENDING);
        const doneList = TasksHelper.changeStatusTask(this.done, TASK_STATUS.DONE);

        this.backendService.updateTasksStatus([...todoList, ...inprocesList, ...doneList]).subscribe(_ => {
            this.todo = [...todoList];
            this.inprocess = [...inprocesList];
            this.done = [...doneList];
        });
    }

    private getTaskList(): void {
        this.isLoading = true;

        this.backendService.getTaskList().pipe(
            takeUntil(this.destroyed$),
            finalize(() => this.isLoading = false)
        ).subscribe((tasks: Task[]) => {
            this.initTaskBaseStatus(tasks);
        });
    }

    private initTaskBaseStatus(tasks: Task[]): void {
        this.todo = TasksHelper.filterTaskByStatus(tasks, TASK_STATUS.TODO);
        this.done = TasksHelper.filterTaskByStatus(tasks, TASK_STATUS.DONE);
        this.inprocess = TasksHelper.filterTaskByStatus(tasks, TASK_STATUS.PENDING);
    }
    
    private openSnackBar(message: string) {
        this.matSnackBar.open(message, '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 1000,
        });
    }
}