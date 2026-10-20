# NestJS Mongoose CRUD API

A production-ready RESTful CRUD API built with [NestJS](https://docs.nestjs.com/) and [Mongoose](https://docs.nestjs.com/techniques/mongodb) showcasing NestJS core architecture.

---

## 🏛️ NestJS Architecture Overview

NestJS follows an Angular-inspired, highly structured, modular architecture built on **Object-Oriented Programming (OOP)**, **Functional Programming (FP)**, and **Dependency Injection (DI)**.

```
Incoming Request
       │
       ▼
┌──────────────┐
│ Global Prefix│  --> /api
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Global Filter│  --> HttpExceptionFilter (Catches errors, formats consistent JSON)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Global Pipe  │  --> ValidationPipe (Validates DTO using class-validator)
└──────┬───────┘
       │
       ▼
┌────────────────────────┐
│ Controller Route Pipe  │  --> ParseObjectIdPipe (Validates 24-hex MongoDB ObjectId)
└──────┬─────────────────┘
       │
       ▼
┌──────────────┐
│  Controller  │  --> Handles HTTP route, status codes, query params, request body
└──────┬───────┘
       │ (Dependency Injection)
       ▼
┌──────────────┐
│   Service    │  --> Business logic, domain rules, validation
└──────┬───────┘
       │ (InjectModel)
       ▼
┌──────────────┐
│Mongoose Model│  --> Interacts with MongoDB (Schema, queries, indexes)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   MongoDB    │
└──────────────┘
```

### Key Architectural Concepts Implemented:
1. **Modules (`@Module`)**: Feature-level encapsulation (`UsersModule`, `ProductsModule`, `AppModule`).
2. **Controllers (`@Controller`)**: Routing, handling incoming requests, returning appropriate HTTP status codes.
3. **Services (`@Injectable`)**: Encapsulates business logic and database interactions via Dependency Injection.
4. **Data Transfer Objects (DTOs)**: Define data shape and enforce payload validation rules at runtime with `class-validator` and `class-transformer`.
5. **Custom Pipes (`PipeTransform`)**: `ParseObjectIdPipe` protects against Mongoose `CastError` by validating MongoDB IDs before they hit the controller.
6. **Exception Filters (`ExceptionFilter`)**: `HttpExceptionFilter` standardizes error responses across all endpoints.
7. **Config Module (`@nestjs/config`)**: Manages environment variables (`.env`) asynchronously.

---

## 📁 Project Directory Structure

```
src/
├── app.controller.spec.ts
├── app.controller.ts            # Root controller (health check)
├── app.module.ts                # Root module (loads Config, Mongoose, Users & Products)
├── app.service.ts               # Root service
├── main.ts                      # Application entrypoint & global configuration
├── common/                      # Shared reusable architecture layers
│   ├── filters/
│   │   └── http-exception.filter.ts   # Global exception formatter
│   └── pipes/
│       ├── parse-object-id.pipe.ts    # Custom MongoDB ObjectId validation
│       └── parse-object-id.pipe.spec.ts
├── users/                       # Feature Module: Users CRUD (mapped to Atlas 'users' collection)
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── schemas/
│   │   └── user.schema.ts
│   ├── users.controller.ts      # REST API routes: /api/users
│   ├── users.controller.spec.ts
│   ├── users.service.ts         # Business logic & conflict handling (duplicate emails)
│   ├── users.service.spec.ts
│   └── users.module.ts
└── products/                    # Feature Module: Products CRUD
    ├── dto/
    │   ├── create-product.dto.ts      # Payload validation for creation
    │   ├── update-product.dto.ts      # Partial payload for updates
    │   └── query-product.dto.ts       # Pagination, search & filters
    ├── schemas/
    │   └── product.schema.ts          # Mongoose schema definition with @Schema, @Prop
    ├── products.controller.ts         # REST API routes: /api/products
    ├── products.controller.spec.ts    # Controller unit tests
    ├── products.service.ts            # Business logic & DB queries
    ├── products.service.spec.ts       # Service unit tests with mocked model
    └── products.module.ts             # Feature module declaration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB**: Local MongoDB instance, Docker, or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nest_crud
```
*(If using MongoDB Atlas, replace `MONGODB_URI` with your connection string).*

### 3. Start MongoDB (Optional via Docker)
If you have Docker installed, start a local MongoDB and Mongo Express GUI with:
```bash
docker compose up -d
```
- MongoDB runs on: `mongodb://localhost:27017`
- Mongo Express Web UI runs on: `http://localhost:8081`

### 4. Run the NestJS Application
```bash
# Development (with hot-reload)
npm run start:dev

# Production build & run
npm run build
npm run start:prod
```

The server starts at `http://localhost:3000/api`.

---

## 🧪 Testing

Run the test suite powered by Vitest:
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Code coverage report
npm run test:cov
```

---

## 📡 API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check | 200 OK |
| **Users** | | | |
| `POST` | `/users` | Create user in Atlas 'users' collection | 201 Created |
| `GET` | `/users` | Get all users | 200 OK |
| `GET` | `/users/:id` | Get user by MongoDB ObjectId | 200 OK |
| `PATCH` | `/users/:id` | Update user | 200 OK |
| `DELETE` | `/users/:id` | Delete user | 200 OK |
| **Products** | | | |
| `POST` | `/products` | Create a product | 201 Created |
| `GET` | `/products` | Get products (supports search, category, price, pagination) | 200 OK |
| `GET` | `/products/:id` | Get single product by MongoDB ObjectId | 200 OK |
| `PATCH` | `/products/:id` | Partially update a product | 200 OK |
| `DELETE` | `/products/:id` | Delete a product | 200 OK |

### Query Parameters for `GET /api/products`:
- `search`: Full-text search across `title` and `description` (e.g. `?search=keyboard`)
- `category`: Filter by category (e.g. `?category=Electronics`)
- `minPrice`: Minimum price filter (e.g. `?minPrice=50`)
- `maxPrice`: Maximum price filter (e.g. `?maxPrice=500`)
- `page`: Page number (default: `1`)
- `limit`: Number of items per page (default: `10`, max: `100`)

---

## 🛠️ Testing the Endpoints

Use the included [`api-requests.http`](./api-requests.http) file with the VS Code / Cursor REST Client extension, or run curl:

```bash
# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Wireless Mouse",
    "description": "Ergonomic 2.4GHz mouse",
    "price": 29.99,
    "category": "Electronics",
    "tags": ["mouse", "wireless"]
  }'

# Fetch all products
curl http://localhost:3000/api/products

# Fetch with pagination and filter
curl "http://localhost:3000/api/products?category=Electronics&page=1&limit=5"
```
