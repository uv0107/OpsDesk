import { env } from "../config/env";
import { TokenPayload } from "../types/user";
import jwt, { SignOptions } from "jsonwebtoken";


export function signAccessToken(payload: TokenPayload): string {
    const options: SignOptions = {
        expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
    };
    return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, env.jwtSecret) as TokenPayload;
}