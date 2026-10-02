//Entry file for the express js 
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import cors from 'cors';
import { apiRouter } from './routes';

export function createApp() {
    const app = express();
    // cors() is a built-in middleware function in Express.js that 
    // allows cross-origin resource sharing.
    app.use(cors());
    // app.use(express.json()) is a built-in middleware function in Express.js that 
    // parses incoming HTTP requests with JSON payloads.
    app.use(express.json());
    // Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
    // The extended option controls whether non-VLA (non-base64) string data will be parsed.
    // In simpler terms: it lets the form data (names, emails, passwords) be read correctly in your code.
    app.use(express.urlencoded({ extended: true }));

    //                  API Routes Definition
    // all routes defined under apiRouter will be prefixed with "/api"
    app.use("/api", apiRouter);

    // Middleware for 404 Not Found
    // If no route matches the incoming request, this middleware will be executed
    app.use(notFound);
    // Centralized Error Handling Middleware
    // This middleware catches any errors thrown in the application and sends a formatted response
    app.use(errorHandler);

    return app;
}