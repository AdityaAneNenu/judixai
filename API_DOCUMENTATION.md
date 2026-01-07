# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Required, max 50 characters
- `email`: Required, valid email format
- `password`: Required, min 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "bio": ""
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### Login User
Authenticate and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "bio": ""
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User
Get the authenticated user's profile.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "bio": "Software Developer",
    "createdAt": "2024-01-06T10:30:00.000Z"
  }
}
```

---

### Update Profile
Update user profile information.

**Endpoint:** `PUT /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "bio": "Full-stack Developer"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "email": "john@example.com",
    "avatar": "",
    "bio": "Full-stack Developer"
  }
}
```

---

### Update Password
Change user password.

**Endpoint:** `PUT /auth/password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Password updated successfully"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## Task Endpoints

### Get All Tasks
Retrieve user's tasks with filtering, sorting, and pagination.

**Endpoint:** `GET /tasks`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `pending`, `in-progress`, `completed` |
| `priority` | string | Filter by priority: `low`, `medium`, `high` |
| `search` | string | Search in title and description |
| `sortBy` | string | Sort field: `createdAt`, `dueDate`, `priority`, `title` |
| `order` | string | Sort order: `asc`, `desc` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

**Example Request:**
```
GET /tasks?status=pending&priority=high&page=1&limit=10&sortBy=createdAt&order=desc
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "total": 15,
  "totalPages": 2,
  "currentPage": 1,
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project",
      "description": "Finish the full-stack assignment",
      "status": "pending",
      "priority": "high",
      "dueDate": "2024-01-10T00:00:00.000Z",
      "user": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-06T10:30:00.000Z",
      "updatedAt": "2024-01-06T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Task
Retrieve a specific task by ID.

**Endpoint:** `GET /tasks/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project",
    "description": "Finish the full-stack assignment",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-10T00:00:00.000Z",
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-06T10:30:00.000Z",
    "updatedAt": "2024-01-06T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

### Create Task
Create a new task.

**Endpoint:** `POST /tasks`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the full-stack assignment",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-01-10"
}
```

**Validation Rules:**
- `title`: Required, max 100 characters
- `description`: Optional, max 500 characters
- `status`: Optional, one of `pending`, `in-progress`, `completed`
- `priority`: Optional, one of `low`, `medium`, `high`
- `dueDate`: Optional, valid ISO date

**Success Response (201):**
```json
{
  "success": true,
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project",
    "description": "Finish the full-stack assignment",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-10T00:00:00.000Z",
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-06T10:30:00.000Z",
    "updatedAt": "2024-01-06T10:30:00.000Z"
  }
}
```

---

### Update Task
Update an existing task.

**Endpoint:** `PUT /tasks/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Complete project - Updated",
  "status": "in-progress"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project - Updated",
    "description": "Finish the full-stack assignment",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2024-01-10T00:00:00.000Z",
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-06T10:30:00.000Z",
    "updatedAt": "2024-01-06T11:00:00.000Z"
  }
}
```

---

### Delete Task
Delete a task.

**Endpoint:** `DELETE /tasks/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

### Get Task Statistics
Get task statistics for the dashboard.

**Endpoint:** `GET /tasks/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "stats": {
    "total": 15,
    "byStatus": {
      "pending": 5,
      "in-progress": 3,
      "completed": 7
    },
    "byPriority": {
      "low": 4,
      "medium": 6,
      "high": 5
    }
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Rate Limiting

In production, implement rate limiting to prevent abuse:
- Authentication endpoints: 5 requests per minute
- Other endpoints: 100 requests per minute

---

## Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-06T10:30:00.000Z"
}
```
