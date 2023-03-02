import { cloneDeep } from 'lodash';

import { Task } from '../models/task.model';
import { TASK_STATUS } from '../enums/task-staus.enum';

export class TasksHelper {
    static filterTaskByStatus(tasks: Task[], taskStatus: TASK_STATUS): Task[] {
        return tasks?.filter(({ status }) => status === taskStatus);
    }

    static changeStatusTask(tasks: Task[], taskStatus: TASK_STATUS): Task[] {
        return cloneDeep(tasks)?.map(task => {
            task.status = taskStatus;
            return task;
        });
    }
}