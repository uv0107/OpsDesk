import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { verifyAccessToken } from "../libs/jwt";

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new AppError("Access token is required", 401));
    return;
  }

  const token = authHeader.split(" ")[1];
  req.user = verifyAccessToken(token);

  next();
}
