

import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
    if (!req.user) {
        next(new AppError("Access token is required", 401));
        return;
    }
    if (req.user.role !== "ADMIN") {
        next(new AppError("You are not authorized to perform this action", 403));
        return;
    }
    next();
}
