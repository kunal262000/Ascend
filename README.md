# ASCEND

Premium streetwear e-commerce platform for men aged 18–35. Oversized tees, cargos, hoodies, and accessories with a minimal, confident aesthetic. Headless architecture with a Next.js 15 storefront and FastAPI backend.

## Tech Stack

| Layer           | Technology                                              |
| --------------- | ------------------------------------------------------- |
| Storefront      | Next.js 15, React 19, TypeScript, TailwindCSS, Shadcn UI |
| Admin Panel     | Next.js 15, React 19, TypeScript, TailwindCSS, Shadcn UI |
| Backend API     | FastAPI (Python 3.11+), SQLAlchemy 2.0 (async), Pydantic |
| Database        | PostgreSQL (via asyncpg)                                 |
| Cache           | Redis                                                   |
| Auth            | JWT (python-jose), bcrypt (passlib)                     |
| Payments        | Cashfree (UPI, cards, wallet, COD)                      |
| Migrations      | Alembic (async)                                         |

## Prerequisites

- **Python 3.11+** — backend runtime
- **Node.js 22+** — frontend runtime
- **Docker** — for PostgreSQL, Redis, and containerized dev
- **bun** — frontend package manager & build tool

## Project Structure

```
ascend/
├── apps/
│   ├── web/              # Customer storefront (Next.js 15)
│   └── admin/            # Admin panel (Next.js 15)
├── backend/
│   ├── app/
│   │   ├── api/          # API routers (v1)
│   │   ├── core/         # Config, security, database, dependencies
│   │   ├── models/       # SQLAlchemy ORM models
│   │   └── schemas/      # Pydantic request/response schemas
│   ├── requirements.txt
│   └── ...
├── database/
│   ├── alembic.ini
│   └── alembic/          # Migration scripts
├── shared/               # Shared types/utilities between frontends
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfile.backend
├── .env.example
└── README.md
```

## Quick Start

### 1. Clone and start infrastructure

```bash
git clone <repo-url> ascend
cd ascend
docker compose -f docker/docker-compose.yml up -d  # PostgreSQL + Redis
```

### 2. Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
```

Run database migrations:

```bash
cd database
alembic upgrade head
cd ..
```

Start the API server:

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000` with:
- Health check: `GET /api/health`
- API docs: `GET /api/docs`

### 3. Frontend setup

```bash
# Storefront
cd apps/web
bun install
bun run dev          # http://localhost:3000

# Admin panel (separate terminal)
cd apps/admin
bun install
bun run dev          # http://localhost:3001
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable                    | Default                                                    | Description               |
| --------------------------- | ---------------------------------------------------------- | ------------------------- |
| `DATABASE_URL`              | `postgresql+asyncpg://postgres:postgres@localhost:5432/ascend` | PostgreSQL connection URL |
| `REDIS_URL`                 | `redis://localhost:6379/0`                                 | Redis connection URL      |
| `SECRET_KEY`                | `dev-secret-change-in-production`                          | JWT signing secret        |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30`                                                     | JWT token TTL (minutes)   |
| `CORS_ORIGINS`              | `http://localhost:3000,http://localhost:3001`              | Allowed CORS origins      |

## API Overview

| Endpoint                  | Method | Description             |
| ------------------------- | ------ | ----------------------- |
| `/api/health`             | GET    | Health check            |
| `/api/v1/auth/register`   | POST   | User registration       |
| `/api/v1/auth/login`      | POST   | User login              |
| `/api/v1/auth/refresh`    | POST   | Refresh access token    |
| `/api/v1/products`        | GET    | List products (paginated, filterable) |
| `/api/v1/products/{slug}` | GET    | Product detail          |
| `/api/v1/products/categories` | GET | List categories       |

Full API documentation available at `/api/docs` when the server is running.

## Documentation

- **apps/web/README.md** — Storefront architecture and development guide
- **apps/admin/README.md** — Admin panel architecture and development guide
- **backend/app/README.md** — API architecture (coming soon)
