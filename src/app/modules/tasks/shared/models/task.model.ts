import { TASK_STATUS } from '../enums/task-staus.enum';

export class Task {
    id!: number;
    description!: string;
    assigneeId?: number | null;
    status!: TASK_STATUS;
}