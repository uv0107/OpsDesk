import Redis from "ioredis";

import { env } from "../config/env";

export const redis = new Redis(env.redisurl);

const redisurl = new URL(env.redisurl);

export const bullmqConnection = {
    host: redisurl.hostname,
    port: redisurl.port,
    maxRetriesPerRequest: null,
}
