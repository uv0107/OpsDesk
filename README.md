# Capstone Project - Scalable Node.js & TypeScript Backend

A production-grade, modular Node.js backend built with TypeScript, Express, PostgreSQL, Redis, BullMQ, and Cloudinary. It features JWT authentication, Google OAuth 2.0, role-based access control, distributed background jobs, Redis caching, and automated database migrations.

---

## Features

- **Authentication & Authorization:**
  - Secure email/password authentication using `bcryptjs` and `jsonwebtoken`.
  - Google OAuth 2.0 (OpenID Connect) with automatic account linking for existing email accounts.
  - Role-Based Access Control (`USER` vs `ADMIN`).
- **Distributed Background Jobs:**
  - BullMQ queue backed by Redis for asynchronous image cleanup.
  - Exponential backoff retry policies and dedicated worker processes.
- **Media Uploads & Caching:**
  - Memory-buffered image uploads directly to Cloudinary using Multer and streams.
  - In-memory Redis caching for public banner queries with automated cache invalidation on mutations.
- **Database & Migrations:**
  - PostgreSQL managed via connection pooling (`pg`).
  - Custom transactional migration runner tracking execution state in a `migrations` table.
- **Observability & Error Handling:**
  - Structured, high-performance logging via `pino` and `pino-pretty`.
  - Centralized error-handling middleware with custom `AppError` abstractions.
- **Dockerized Infrastructure:**
  - Multi-container setup for PostgreSQL (port 5440) and Redis (port 6385).

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime & Language** | Node.js (v20+), TypeScript (`tsx`) |
| **Web Framework** | Express 5 |
| **Databases** | PostgreSQL 16, Redis 7 |
| **Queue / Background Jobs** | BullMQ |
| **Cloud Storage** | Cloudinary |
| **Authentication** | JWT, Google OAuth 2.0 (`google-auth-library`) |
| **Logging** | Pino, Pino-Pretty |
| **Containerization** | Docker, Docker Compose |

---

## Project Structure

```text
├── docker-compose.yml          # PostgreSQL & Redis container definitions
├── migrations/                 # Sequential SQL migration files
├── src/
│   ├── app.ts                  # Express application setup & middleware pipeline
│   ├── server.ts               # Server bootstrap & port listener
│   ├── config/
│   │   └── env.ts              # Strongly-typed environment configuration
│   ├── errors/                 # AppError & centralized error definitions
│   ├── libs/                   # Third-party adapters (db, redis, cloudinary, google, logger)
│   ├── middlewares/            # Auth, role-validation, upload, error handlers
│   ├── queues/                 # BullMQ queue definitions & job producers
│   ├── repositories/           # Data access layer (PostgreSQL SQL queries)
│   ├── routes/                 # Express API routes
│   ├── scripts/                # Database migration scripts
│   ├── services/               # Core business logic
│   ├── types/                  # TypeScript interface definitions
│   └── workers/                # BullMQ background workers
```

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v20 or later)
- [Docker](https://www.docker.com/) & Docker Compose

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/uv0107/CapStoneProject.git
cd CapStoneProject
npm install
```

### 3. Environment Setup
Copy the sample environment file and fill in your credentials:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
PORT=5000
NODE_ENV=development
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5440/nodejs-capstone

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_ACCESS_EXPIRES_IN=15m

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis
REDIS_URL=redis://localhost:6385

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
```

### 4. Start Docker Containers
Start PostgreSQL and Redis services:
```bash
npm run docker:up
```

### 5. Run Database Migrations
Execute pending SQL migrations against PostgreSQL:
```bash
npm run migrate
```

### 6. Start the Application
Run the Express API server and the background worker in separate terminals:

**Terminal 1 (API Server):**
```bash
npm run dev
```

**Terminal 2 (BullMQ Worker):**
```bash
npm run worker
```

---

## API Endpoints

All endpoints are mounted under `/api`.

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user with email and password |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive access token |
| `GET` | `/api/auth/profile` | Authenticated | Retrieve authenticated user profile |
| `GET` | `/api/auth/google` | Public | Redirects browser to Google OAuth consent screen |
| `GET` | `/api/auth/google/callback` | Public | Google OAuth redirect callback (returns JWT) |

### Tasks (`/api/tasks` & `/api/admin/tasks`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/tasks` | User | Create a support task |
| `GET` | `/api/tasks` | User | List all tasks created by the current user |
| `GET` | `/api/admin/tasks` | Admin | List all tasks across all users |
| `PATCH` | `/api/admin/tasks/:id` | Admin | Update status / resolve a task |

### Admin Banners (`/api/admin/banner`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/banner` | Admin | Upload banner image (streamed to Cloudinary, invalidates cache) |
| `GET` | `/api/admin/banner` | Authenticated | Get all banners (served from Redis cache when warm) |
| `DELETE` | `/api/admin/banner/:id` | Admin | Delete banner from DB & dispatch BullMQ cleanup job |

### Health Check (`/api/health`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Service health and liveness probe |

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the API server with live reloading using `tsx watch` |
| `npm run worker` | Starts the BullMQ background worker process |
| `npm run migrate` | Executes all pending SQL migration scripts |
| `npm run build` | Compiles TypeScript files to JavaScript in `dist/` |
| `npm run start` | Runs the production bundle from `dist/server.js` |
| `npm run docker:up` | Builds and starts Docker services (PostgreSQL & Redis) |
| `npm run docker:down` | Stops and removes running Docker containers |
