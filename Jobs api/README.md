# Jobs API

A simple RESTful API for managing job postings with authentication and authorization.  
Built as a learning project while exploring backend development with Node.js, Express, MongoDB, and JWT-based auth.

This project is part of the **webdev-mini-projects** repository, where I upload small projects while learning web development.

---

## Features

- User authentication (Register / Login)
- JWT-based authorization
- CRUD operations on jobs
- Jobs are **user-specific** (each user can only access their own jobs)
- Centralized error handling
- Clean project structure (controllers, routes, middleware, models)

---

## Tech Stack

- **Node.js**
- **Express**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **dotenv** for environment variables

---

## Project Structure

```
Jobs api/
├── app.js
├── package.json
├── controllers/
│ ├── auth.js
│ └── jobs.js
├── db/
│ └── connect.js
├── errors/
│ ├── bad-request.js
│ ├── custom-error.js
│ ├── not-found.js
│ └── unauthenticated.js
├── middleware/
│ ├── authentication.js
│ ├── error-handler.js
│ └── not-found.js
├── models/
│ ├── Job.js
│ └── User.js
└── routes/
├── auth.js
└── jobs.js
```

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/webdev-mini-projects.git
   cd webdev-mini-projects/jobs-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**

   Create a `.env` file in the root directory and set env variables:

   ```env
   PORT=your_port_number
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_LIFETIME=1d
   ```

4. **Run the server**
   ```bash
   npm start
   ```

---

## 🔐 API Endpoints

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Jobs
- `GET /api/v1/jobs`
- `POST /api/v1/jobs`
- `GET /api/v1/jobs/:id`
- `PATCH /api/v1/jobs/:id`
- `DELETE /api/v1/jobs/:id`


 All job routes are protected and require a valid JWT in the Authorization header:
```bash
   Authorization: Bearer <token>
   ```

---

## 🧠 Why this project?

The goal of this project was to:
- Understand backend architecture
- Practice REST API design
- Learn authentication & authorization flows
- Get comfortable with MongoDB + Mongoose

---

