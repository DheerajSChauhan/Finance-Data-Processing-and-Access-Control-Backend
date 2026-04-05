# Finance Dashboard API

Finance Dashboard API is an Express and PostgreSQL backend for managing users, transactions, and dashboard analytics. It uses JWT authentication, role-based access control, soft deletes, and raw SQL aggregation queries.

## Setup

1. Clone the repository and install dependencies.
2. Copy `.env.example` to `.env` and fill in the values.
3. Run the migration in `migrations/init.sql` against PostgreSQL.
4. Start the app with `npm run dev` for development or `npm start` for production.
5. Optionally run `npm run seed` to populate demo users and transactions.

## Environment Variables

- `PORT` - HTTP server port.
- `DATABASE_URL` - PostgreSQL connection string.
- `JWT_SECRET` - Secret used to sign access tokens.
- `JWT_EXPIRES_IN` - JWT expiration time, such as `7d`.

## Health Check

```bash
curl http://localhost:3000/health
# { "success": true, "data": { "status": "ok" } }
```

## API Documentation

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

Example login response:

```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

### Users

Admin only.

- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

#### Example — List users (admin only)

```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer <your-jwt-token>"
```

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@finance.com",
      "role": "admin",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Transactions

- `GET /api/transactions?type=income&category=salary&from=2024-01-01&to=2024-12-31&page=1&limit=20`
- `GET /api/transactions/:id`
- `POST /api/transactions`
- `PATCH /api/transactions/:id`
- `DELETE /api/transactions/:id`

Create, update, and delete are admin only.

#### Example — List filtered transactions

```bash
curl "http://localhost:3000/api/transactions?type=income&page=1" \
  -H "Authorization: Bearer <your-jwt-token>"
```

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "amount": "5000.00",
        "type": "income",
        "category": "Salary",
        "date": "2024-03-15",
        "notes": "March salary",
        "is_deleted": false,
        "created_at": "2024-03-15T10:00:00.000Z",
        "updated_at": "2024-03-15T10:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 1 }
  }
}
```

#### Example — Create a transaction (admin only)

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1500.00,
    "type": "income",
    "category": "Freelance",
    "date": "2024-03-28",
    "notes": "Consulting project"
  }'
```

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": null,
    "amount": "1500.00",
    "type": "income",
    "category": "Freelance",
    "date": "2024-03-28",
    "notes": "Consulting project",
    "is_deleted": false,
    "created_at": "2024-03-28T12:00:00.000Z",
    "updated_at": "2024-03-28T12:00:00.000Z"
  }
}
```

### Dashboard

- `GET /api/dashboard/summary`
- `GET /api/dashboard/by-category`
- `GET /api/dashboard/trends`
- `GET /api/dashboard/recent`

#### Example — Summary

```bash
curl http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer <your-jwt-token>"
```

```json
{
  "success": true,
  "data": {
    "total_income": "15800.00",
    "total_expense": "1990.00",
    "net_balance": "13810.00"
  }
}
```

## Roles

- `viewer` - can log in and view transactions and dashboard data.
- `analyst` - can log in and view transactions and dashboard data.
- `admin` - can do everything, including managing users and transactions.

## Assumptions

- Soft delete is used for transactions and user deactivation.
- JWT access tokens are used without refresh tokens.
- UUIDs are used as primary keys.
- Input validation is enforced on POST and PATCH routes.
- Dashboard endpoints are intentionally open to all authenticated roles (viewer, analyst, admin) as per the role matrix.
- `user_id` on a transaction cannot be unlinked once set (COALESCE behavior by design).
- The `notes` field accepts raw strings; XSS sanitization is out of scope for a pure API backend.
- No refresh token flow — JWT expiry is configured via `JWT_EXPIRES_IN` in `.env`.

## Possible Improvements

- Add rate limiting.
- Add refresh tokens.
- Add automated tests.
- Add pagination metadata for dashboard lists if needed.
