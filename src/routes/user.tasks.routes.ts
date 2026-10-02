import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createUserTask, getUserTaskById, getUserTasks, updateUserTask, deleteUserTask } from "../services/user.task.service";

export const userTasksRouter = Router();

userTasksRouter.use(authenticate);

userTasksRouter.post("/", async (req, res, next) => {
    try {
        const task = await createUserTask(req.user!.userId, req.body.title);

        res.status(201).json({
            success: true,
            data: {
                task,
            },
        });
    } catch (error) {
        next(error);
    }
});

userTasksRouter.get("/", async (req, res, next) => {
    try {

        const tasks = await getUserTasks(req.user!.userId);
        res.status(200).json({
            success: true,
            data: {
                tasks,
            },
        })

    } catch (error) {
        next(error);
    }
})
// dynamic routes can be added here

userTasksRouter.get("/:taskId", async (req, res, next) => {
    try {

        const task = await getUserTaskById(req.params.taskId, req.user!.userId);
        res.status(200).json({
            success: true,
            data: {
                task
            }
        })

    } catch (error) {
        next(error);
    }
})

userTasksRouter.patch("/:taskId", async (req, res, next) => {
    try {
        const task = await updateUserTask(req.params.taskId, req.user!.userId, req.body.title);
        res.status(200).json({
            success: true,
            data: {
                task,
            },
        });
    } catch (error) {
        next(error);
    }
})

userTasksRouter.delete("/:taskId", async (req, res, next) => {
    try {
        await deleteUserTask(req.params.taskId, req.user!.userId);
        res.status(200).json({
            success: true,
            message: "task deleted"
        })
    } catch (error) {
        next(error);
    }
})
