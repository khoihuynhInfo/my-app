import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { Task } from './modules/tasks/shared/models/task.model';
import { TASK_STATUS } from './modules/tasks/shared/enums/task-staus.enum';
import { User } from './modules/tasks/shared/models/user.model';

function randomDelay() {
    return Math.random() * 1000;
}

@Injectable()
export class BackendService {
    storedTasks: Task[] = [
        {
            id: 0,
            description: "Install a monitor arm abc",
            assigneeId: null,
            status: TASK_STATUS.TODO
        },
        {
            id: 3,
            description: "Install a monitor arm",
            assigneeId: 111,
            status: TASK_STATUS.TODO
        },
        {
            id: 1,
            description: "Move the desk to the new location",
            assigneeId: 111,
            status: TASK_STATUS.PENDING
        },
        {
            id: 2,
            description: "Move the desk to the new location 1",
            assigneeId: 222,
            status: TASK_STATUS.DONE
        },
    ];

    storedUsers: User[] = [
        { id: 111, name: "Mike" },
        { id: 222, name: "James" }
    ];

    lastId = 1;

    constructor() {
        this.setItemTaskList(this.storedTasks);
    }

    getTaskList(): Observable<Task[]> {
        const taskListString = localStorage.getItem('taskList');
        const taskListObj = taskListString ? JSON.parse(taskListString) : '';
        return (of(taskListObj)).pipe(delay(randomDelay()));
    }

    getTaskListById(taskId: string): Observable<Task[]> {
        const taskListString = localStorage.getItem('taskList');
        const taskListObj = taskListString ? JSON.parse(taskListString) : [];
        const dataFilter = taskListObj?.filter((task: Task) => task.id === Number(taskId));
        return (of(dataFilter)).pipe(delay(randomDelay()));
    }

    getTaskDetail(id: number): Observable<Task | undefined> {
        return of(this.findTaskById(id)).pipe(delay(randomDelay()));
    }

    getUserList() {
        return of(this.storedUsers).pipe(delay(randomDelay()));
    }

    getUserByID(id: number): Observable<User | undefined> {
        return of(this.findUserById(id)).pipe(delay(randomDelay()));
    }

    removeTask(curretTask: Task) {
        const taskListString = localStorage.getItem('taskList');
        const taskListObj = taskListString ? JSON.parse(taskListString) : '';

        this.setItemTaskList(
            taskListObj?.filter((task: Task) => task?.id !== curretTask.id)
        );
        return of(true);
    }

    addNewTask(payload: { description: string }): Observable<Task> {
        const newTask: Task = {
            id: ++this.lastId,
            description: payload.description,
            status: TASK_STATUS.PENDING
        };

        this.storedTasks = this.storedTasks.concat(newTask);

        this.setItemTaskList(this.storedTasks);

        return of(newTask).pipe(delay(randomDelay()));
    }

    assignTaskToUser(taskId: number, userId: number | undefined): Observable<Task> {
        return this.updateTask(taskId, { assigneeId: userId });
    }

    completeTask(taskId: number, status: TASK_STATUS.PENDING): Observable<Task> {
        return this.updateTask(taskId, { status });
    }

    updateTask(taskId: number, updates: Partial<Omit<Task, "id">>): Observable<Task> {
        const foundTask = this.findTaskById(taskId);

        if (!foundTask) {
            return throwError(new Error("task not found"));
        }

        const updatedTask = { ...foundTask, ...updates };

        this.storedTasks = this.storedTasks.map(task => task.id === taskId ? updatedTask : task);
        this.setItemTaskList(this.storedTasks);
        return of(updatedTask).pipe(delay(randomDelay()));
    }

    updateTasksStatus(tasks: Task[]): Observable<boolean> {
        this.setItemTaskList(tasks);
        return of(true).pipe(delay(randomDelay()));
    }

    private setItemTaskList(storedTasks: Task[]) {
        localStorage.setItem('taskList', JSON.stringify(storedTasks))
    }

    private findTaskById(id: number): Task | undefined {
        const taskListString = localStorage.getItem('taskList');
        const taskListObj = taskListString ? JSON.parse(taskListString) : '';

        return taskListObj.find((task: Task) => task.id === +id);
    }

    private findUserById(id: number): User | undefined {
        return this.storedUsers.find(user => user.id === +id);
    }
}