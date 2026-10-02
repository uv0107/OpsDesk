// combining all routes here across the application.
//even 2000+ routes also we can combine 
// PLUGGABILITY
import { healthRouter } from "./health.routes";
import { Router } from "express";
import { authRouter } from "./auth.routes";
import { userTasksRouter } from "./user.tasks.routes";
import { adminTaskRouter } from "./admin.tasks.routes";

export const apiRouter = Router();

//                      API Routes Definition
// all routes defined under apiRouter will be prefixed with "/api"
apiRouter.use(healthRouter);

apiRouter.use("/auth", authRouter)
apiRouter.use("/tasks", userTasksRouter)
apiRouter.use("/admin/tasks", adminTaskRouter)
