import dotenv from "dotenv";

dotenv.config()
function checkRequiredEnvVariables(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export const env = {
    port: Number(process.env.PORT ?? 5000),
    isProduction: (process.env.NODE_ENV ?? "development") === "production",
    nodeEnv: process.env.NODE_ENV ?? "development",
    loglevel: process.env.LOG_LEVEL ?? "info",
    databaseUrl: checkRequiredEnvVariables("DATABASE_URL"),
    jwtSecret: process.env.JWT_SECRET || "super_secret_jwt",
    jwtExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
} as const;


