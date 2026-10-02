import { task } from "../types/task";
import { AppError } from "../errors/AppError";
import { findAllTasks, updateTaskStatus } from "../repositories/admin.task.repository";

type AdminTaskListQuery = {
    search?: string;
    status?: string;
};

type AdminTaskListResponse = {
    tasks: task[];
};

const TASK_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;
type TaskStatus = (typeof TASK_STATUSES)[number];


export async function getAdminTasks(
    query: AdminTaskListQuery,
): Promise<AdminTaskListResponse> {
    const search = query.search?.trim() || undefined;
    const status = query.status?.trim() || undefined;

    if (status && !TASK_STATUSES.includes(status as TaskStatus)) {
        throw new AppError(
            "status must be between open, inprogress or resolved",
            400
        );
    }

    const tasks = await findAllTasks({
        search,
        status,
    });

    return {
        tasks,
    };
}

export async function updateAdminTaskStatus(
    taskId: string,
    status: unknown,
): Promise<task> {
    if (
        typeof status !== "string" ||
        !TASK_STATUSES.includes(status as TaskStatus)
    ) {
        throw new AppError(
            "status must be between open, inprogress or resolved",
            400
        );
    }

    const task = await updateTaskStatus(taskId, status);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    return task;
}
