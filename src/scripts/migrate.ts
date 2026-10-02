// The pg package (also known as node-postgres) is a Non-blocking PostgreSQL client for Node.js.
// Core Purposes
// Executing SQL Queries: It allows you to send raw SQL statements (like SELECT, INSERT, UPDATE, DELETE) from your Javascript code directly to PostgreSQL and receive the results.
// Connection Pooling: Opening a new connection to a database for every single user request is incredibly slow. The pg package provides a Pool mechanism that keeps a collection of open connections alive, reusing them to handle incoming traffic highly efficiently.
// Data Type Translation: PostgreSQL and Javascript handle data types differently (e.g., PostgreSQL timestamps or JSONB data). The pg package automatically translates database types into standard JavaScript objects, strings, numbers, or dates, and vice versa.

import { promises } from "fs";
import fs from "node:fs";
import path from "path";
import { pool } from "../libs/db";
import { logger } from "../libs/logger";
const CREATES_MIGRATIONS_SQL_TABLE = `
CREATE TABLE IF NOT EXISTS MIGRATIONS(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
)`
const MIGRATIONS_DIR = path.join(process.cwd(), "migrations")


type MIGRATIONROW = {
    name: string
}

async function getExecutedMigrations(): Promise<string[]> {
    const res = await pool.query<MIGRATIONROW>(
        `SELECT name FROM MIGRATIONS ORDER BY name`
    )
    return res.rows.map((row) => row.name)
}

function getMigrationFiles(): string[] {
    return fs.readdirSync(MIGRATIONS_DIR).filter((file) => file.endsWith('.sql')).sort();
}


async function runMigration(fileName: string): Promise<void> {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, fileName), "utf-8");
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query(`INSERT INTO migrations(name) VALUES ($1)`, [fileName]);
        await client.query("COMMIT");
        logger.info(`Migration ${fileName} completed successfully.`);
    } catch (error) {
        await client.query("ROLLBACK");
        // logger.error(`Failed to run migration: ${fileName}`, error);
        throw error;
    } finally {
        client.release();
    }
}

async function migrate(): Promise<void> {
    await pool.query(CREATES_MIGRATIONS_SQL_TABLE);

    const executed = new Set(await getExecutedMigrations());
    console.log(`Executed migrations:`, executed);

    const pending = getMigrationFiles().filter((file) => !executed.has(file));
    console.log(`Pending migrations:`, pending);

    if (pending.length === 0) {
        logger.info(`No pending migrations`);
        return;
    }

    for (const fileName of pending) {
        await runMigration(fileName)
    }

    console.log(`All migrations completed successfully.`);
}

migrate().catch((error) => {
    logger.error("Migration failed:", error);
    process.exit(1);
}).finally(async () => {
    await pool.end();
});

