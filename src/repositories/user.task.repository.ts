import { task } from "../types/task"
import { pool } from "../libs/db";
type TaskRow = task;
export async function createTask(userId: string, title: string): Promise<task> {
    const result = await pool.query<TaskRow>(
        `
        INSERT INTO support_tasks (title, users_id)
        VALUES ($1, $2)
        RETURNING id, title, status, users_id, created_at, updated_at
        `,
        [title, userId],
    );

    return result.rows[0];
}

export async function fetchTaskByUserId(userId: string): Promise<task[]> {

    const result = await pool.query<task>(
        `SELECT id,title,status,users_id,created_at,updated_at
        FROM support_tasks WHERE users_id = $1`,
        [userId],
    );
    return result.rows;
}

export async function findTaskByIdAndUserId(
    taskId: string,
    userId: string
): Promise<task> {
    const result = await pool.query<task>(
        `SELECT id,title,status,users_id,created_at,updated_at
        FROM support_tasks WHERE id = $1 AND users_id = $2`,
        [taskId, userId],
    );
    return result.rows[0] ?? null;
}

export async function updateTask(
    taskId: string,
    userId: string,
    title: string
): Promise<task | null> {
    const result = await pool.query<task>(
        `UPDATE support_tasks
        SET title = $1, updated_at = NOW()
        WHERE id = $2 AND users_id = $3
        RETURNING id, title, status, users_id, created_at, updated_at`,
        [title, taskId, userId],
    );
    return result.rows[0] ?? null;
}
export async function deleteTask(
    taskId: string,
    userId: string
): Promise<boolean> {
    const result = await pool.query<task>(
        `DELETE FROM support_tasks
        WHERE id = $1 AND users_id = $2`,
        [taskId, userId],
    );
    return (result.rowCount ?? 0) > 0;
}
