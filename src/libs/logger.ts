// Here is exactly how it filters your logs:
// 🟢 Prints: Important things like info (app started), warn (slow speed), and error (crash).
// ❌ Hides: Noisy things like debug and trace (deep step-by-step developer notes).Why
import { env } from "../config/env"
import pino from 'pino';

export const logger = pino(
    {
        level: env.loglevel,
        transport: env.isProduction
            ? undefined :
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: "SYS:standard",
                }
            }

    }
)   