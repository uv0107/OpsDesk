import { NextFunction, Request, Response } from "express";
import { logger } from "../libs/logger";
import { AppError } from "../errors/AppError";
export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (err instanceof AppError) {
        res.status(err.statusCode).json(
            {
                success: false,
                message: err.message
            });
        return;
    }
    logger.error(err);

    res.status(500).json(
        {
            success: false,
            message: "Internal Server Error"
        });
}