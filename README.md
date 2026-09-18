# Attendance & User Management System (Backend API)

A RESTful API built with **Node.js**, **Express**, and **PostgreSQL** for managing user authentication, roles, departments, and attendance tracking.

---

## Features

- **Authentication & Authorization** — JWT-based authentication with role-based access control (`admin`, `manager`, `employee`).
- **User Management** — Admins/managers can create, list, view, and delete users. Managers are restricted to creating `employee` accounts only.
- **Department Management** — Create, list, view, and delete departments (admin/manager access).
- **Attendance System** — Check-in/check-out per user, with a database-level constraint preventing more than one open (not-yet-checked-out) attendance record per user.
- **Database Constraints** — PostgreSQL foreign keys, unique constraints, and check constraints (e.g. `check_out_time >= check_in_time`) enforce data integrity.

---

## Tech Stack

| Layer     | Technology                       |
|-----------|------------------------------------|
| Runtime   | Node.js                            |
| Framework | Express.js                          |
| Database  | PostgreSQL                           |
| Security  | bcrypt, JSON Web Tokens (JWT)         |
| Testing   | Postman                                |

---

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- npm
  
### Installation

```bash
git clone https://github.com/retagkhaled960-hash/attendance-system.git
cd attendance-system
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DB_USER=your_db_user_here
DB_PASSWORD=your_db_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name_here
JWT_SECRET=your_jwt_secret_key
```

### Database Setup

Run the SQL files against your PostgreSQL database:

```bash
psql -d your_db -f database/schema.sql
Note: Database tables and initial structure can be set up via your local migration/schema setup, and you can register your first user (or admin) directly through the /api/auth/register endpoint.
```

### Running the Server

```bash
node server.js
# or,
npx nodemon server.js
```

The server listens on the port set in `.env` (defaults to `5000`).

---

## 📌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Description                                              | Access |
|--------|-------------|-------------------------------------------------------------|--------|
| POST   | `/register` | Register a new user (always created with `employee` role)     | Public |
| POST   | `/login`    | Login and receive a JWT token                                    | Public |

**POST /api/auth/register — Request Body**
```json
{
  "username": "ahmed_ali",
  "email": "ahmed.ali@example.com",
  "password": "SecurePass123"
}
```

**Response**
```json
{
  "message": "User registered successfully!",
  "user": {
    "id": 12,
    "username": "ahmed_ali",
    "email": "ahmed.ali@example.com",
    "role": "employee",
    "employee_code": "EMP-2026-012",
    "department_id": null,
    "created_at": "2026-09-18 07:21:05 AM"
  }
}
```

**POST /api/auth/login — Request Body**
```json
{
  "email": "ahmed.ali@example.com",
  "password": "SecurePass123"
}
```

**Response**
```json
{
  "message": "Logged in successfully!",
  "token": "your_jwt_token_here",
  "user": {
    "id": 12,
    "username": "ahmed_ali",
    "email": "ahmed.ali@example.com",
    "role": "employee",
    "employee_code": null
  }
}
```

### Users (`/api/users`) — Protected

| Method | Endpoint | Description                                                | Access          |
|--------|----------|----------------------------------------------------------------|-----------------|
| GET    | `/`      | List all users                                                   | admin, manager  |
| GET    | `/:id`   | Get a single user by ID                                          | admin, manager  |
| POST   | `/`      | Create a user (managers can only create `employee` accounts)      | admin, manager  |
| DELETE | `/:id`   | Delete a user by ID                                                | admin           |

### Departments (`/api/departments`) — Protected

| Method | Endpoint | Description             | Access          |
|--------|----------|---------------------------|-----------------|
| GET    | `/`      | List all departments       | admin           |
| GET    | `/:id`   | Get a department by ID     | admin, manager  |
| POST   | `/`      | Create a department        | admin, manager  |
| DELETE | `/:id`   | Delete a department        | admin           |

### Attendance (`/api/attendance`) — Protected

| Method | Endpoint         | Description                                    | Access                    |
|--------|-------------------|---------------------------------------------------|---------------------------|
| GET    | `/`               | List all attendance records                          | admin, manager             |
| GET    | `/users/:userId`  | List attendance records for a specific user            | admin, manager             |
| POST   | `/check-in`       | Record a check-in for the logged-in user                 | admin, manager, employee   |
| POST   | `/check-out`      | Record a check-out for the logged-in user                  | admin, manager, employee   |

All protected routes require:
```
Authorization: Bearer <token>
```

**POST /api/attendance/check-in — Response**
```json
{
  "message": "Checked in successfully!",
  "attendance": {
    "id": 101,
    "user_id": 12,
    "check_in_time": "2026-09-18 07:21:05 PM",
    "check_out_time": null,
    "status": "Present"
  }
}
```
Returns `409 Conflict` if the user already has an open check-in.

**POST /api/attendance/check-out — Response**
```json
{
  "message": "Checked out successfully!",
  "attendance": {
    "id": 101,
    "user_id": 12,
    "check_in_time": "2026-09-18 07:21:05 AM",
    "check_out_time": "2026-09-18 05:24:05 PM",
    "status": "Present"
  }
}
```
Returns `404 Not Found` if there's no open check-in to close.

---

## 🔐 Roles & Permissions

| Role     | Permissions                                                                          |
|----------|-------------------------------------------------------------------------------------------|
| admin    | Full access: manage users (any role), departments, and view all attendance                 |
| manager  | Can create/view users (employee accounts only), manage departments, view attendance          |
| employee | Can check in/out only                                                                          |

---

## 🧪 Testing

All endpoints have been tested manually using **Postman**, covering:
- Registration/login with valid and invalid credentials
- Role-based access control on protected routes
- Duplicate check-in prevention (unique open-attendance constraint)
- Check-out with no active check-in
- Database constraint violations (unique email, foreign keys)


