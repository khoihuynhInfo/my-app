import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { debounceTime, finalize, switchMap, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';

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
    inprocess!: Task[];
    isLoading = false;
    searchTaskFormControl = new FormControl();
    todo!: Task[];

    constructor(
        private backendService: BackendService
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
}