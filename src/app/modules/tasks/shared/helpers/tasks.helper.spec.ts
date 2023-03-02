import { Task } from '../models/task.model';
import { TASK_STATUS } from '../enums/task-staus.enum';
import { TasksHelper } from './tasks.helper';

describe('TasksHelper', () => {
    let tasks: Task[];

    beforeEach(() => {
        tasks = [
            { id: 1, description: 'Task 1', status: TASK_STATUS.TODO },
            { id: 2, description: 'Task 2', status: TASK_STATUS.PENDING }
        ];
    });

    describe('filterTaskByStatus', () => {
        it('should filter tasks by status', () => {
            const filteredTasks = TasksHelper.filterTaskByStatus(tasks, TASK_STATUS.PENDING);
            expect(filteredTasks.length).toBe(1);
            expect(filteredTasks[0].description).toBe('Task 2');
        });

        it('should return an empty array if no tasks match the status', () => {
            const filteredTasks = TasksHelper.filterTaskByStatus(tasks, TASK_STATUS.DONE );
            expect(filteredTasks.length).toBe(0);
        });

        it('should return undefined if tasks is undefined', () => {
            const filteredTasks = TasksHelper.filterTaskByStatus(undefined as any, TASK_STATUS.PENDING);
            expect(filteredTasks).toBeUndefined();
        });
    });

    describe('changeStatusTask', () => {
        it('should change the status of all tasks', () => {
            const newStatus = TASK_STATUS.PENDING;
            const changedTasks = TasksHelper.changeStatusTask(tasks, newStatus);
            expect(changedTasks.length).toBe(tasks.length);
            expect(changedTasks.every((task) => task.status === newStatus)).toBeTrue();
            expect(changedTasks).not.toBe(tasks);
        });

        it('should return an empty array if tasks is empty', () => {
            const changedTasks = TasksHelper.changeStatusTask([], TASK_STATUS.PENDING);
            expect(changedTasks.length).toBe(0);
        });

        it('should return undefined if tasks is undefined', () => {
            const changedTasks = TasksHelper.changeStatusTask(undefined as any, TASK_STATUS.PENDING);
            expect(changedTasks).toBeUndefined();
        });
    });
});