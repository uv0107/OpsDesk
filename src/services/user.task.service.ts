import { task } from "../types/task";
import { AppError } from "../errors/AppError";
import { createTask, fetchTaskByUserId, findTaskByIdAndUserId, updateTask, deleteTask } from "../repositories/user.task.repository";

function validateTitle(title: unknown): string {
    if (typeof title !== "string" || !title.trim()) {
        throw new AppError("Title is required", 400);
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length > 100) {
        throw new AppError("Title must be 100 char or less", 400);
    }

    return trimmedTitle;
}


export async function createUserTask(userId: string, title: unknown): Promise<task> {
    const validTitle = validateTitle(title);
    return createTask(userId, validTitle);
}

export async function getUserTasks(userId: string): Promise<task[]> {
    return fetchTaskByUserId(userId);
}
export async function getUserTaskById(
    taskId: string,
    userId: string
): Promise<task> {
    const task = findTaskByIdAndUserId(taskId, userId);
    if (!task) {
        throw new AppError("Task not found", 404);
    }
    return task;
}

export async function updateUserTask(
    taskId: string,
    userId: string,
    title: string
): Promise<task> {

    const validTitle = validateTitle(title);
    const updatedTask = await updateTask(taskId, userId, validTitle);
    if (!updatedTask) {
        throw new AppError("Task not found", 404);
    }
    return updatedTask;
}
export async function deleteUserTask(
    taskId: string,
    userId: string
): Promise<void> {

    const deletedTask = await deleteTask(taskId, userId);

    if (!deletedTask) {
        throw new AppError("task not found", 404);
    }
}
