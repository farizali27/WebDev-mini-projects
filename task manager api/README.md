# Task Manager API

A simple **Task Manager REST API** built using **Node.js, Express, and MongoDB**.  
This project is part of my **Web Dev Mini Projects** repository and was created while following a tutorial to understand backend fundamentals, REST APIs, and database integration.

---

## 📌 Purpose of This Project

The goal of this project was to:

- Learn how REST APIs are structured
- Understand CRUD operations using MongoDB & Mongoose
- Practice Express routing & controllers
- Learn proper project structure for backend services
- Work with environment variables and async operations

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Frontend
- Static HTML/CSS inside the `public/` folder

---

## ✨ Features

- Create tasks
- Retrieve all tasks
- Retrieve a single task
- Update tasks
- Delete tasks
- MongoDB-based persistent storage
- RESTful API design

---

## 📂 Project Structure


```text
├── controller
│   └── tasks.js          # Request logic (business logic layer)
├── db
│   └── connect.js        # Database connection
├── errors
│   └── custom-error.js  # Custom error classes
├── middleware
│   ├── async.js          # Async wrapper to avoid try/catch spam
│   ├── error-handler.js # Central error handler
│   └── not-found.js     # 404 middleware
├── models
│   └── task.js           # Mongoose schema/model
├── routes
│   └── task.js           # API routes
├── public                # Static assets
├── .env                  # Environment variables
├── app.js                # App entry point
└── README.md
```

---

## 📡 API Endpoints

| Method | Endpoint               | Description        |
|----------|------------------------|--------------------|
| GET      | `/api/v1/tasks`        | Get all tasks      |
| POST     | `/api/v1/tasks`        | Create a task      |
| GET      | `/api/v1/tasks/:id`    | Get single task    |
| PATCH    | `/api/v1/tasks/:id`    | Update task        |
| DELETE   | `/api/v1/tasks/:id`    | Delete task        |

