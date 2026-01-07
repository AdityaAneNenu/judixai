# Judix - Full-Stack Task Management Application

A modern, scalable, and secure web application featuring Authentication and a Dashboard, built with **Next.js 14**, **Node.js/Express**, and **Firebase Firestore** (via Firebase Admin SDK). Google Sign-In is supported.

## 🚀 Features

### Frontend
- **Next.js 14** with App Router
- **TailwindCSS** for responsive design
- **TypeScript** for type safety
- Client & server-side form validation
- Protected routes with JWT authentication
- Modern UI/UX with smooth animations

### Backend
- **Node.js/Express** REST API
- **Firebase Firestore** (server-side via Firebase Admin SDK)
- **JWT-based authentication**
- **bcrypt** password hashing
- Input validation with express-validator
- Comprehensive error handling

### Core Functionality
- ✅ User Registration & Login
- ✅ Profile Management (view/edit)
- ✅ Task CRUD Operations
- ✅ Search & Filter Tasks
- ✅ Task Statistics Dashboard
- ✅ Logout Flow

## 📁 Project Structure

```
judix/
├── backend/
│   ├── config/
│   │   └── db.js              # Firebase Admin init (Firestore)
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── taskController.js  # Task CRUD logic
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── errorHandler.js    # Global error handling
│   │   └── validate.js        # Request validation
│   ├── models/
│   │   ├── User.js            # User model (Firestore accessors)
│   │   └── Task.js            # Task model (Firestore accessors)
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   └── tasks.js           # Task routes
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Express server
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   │   ├── tasks/     # Tasks page
│   │   │   │   ├── profile/   # Profile page
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx   # Dashboard home
│   │   │   ├── login/         # Login page
│   │   │   ├── register/      # Register page
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx       # Landing page
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskModal.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   └── lib/
│   │       └── api.ts         # Axios API client
│   ├── .env.local
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── API_DOCUMENTATION.md       # API docs
├── SCALABILITY.md             # Scalability guide
└── README.md
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with a Service Account (for Admin SDK)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env` (see `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Firebase Admin (Service Account)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_client_email@your-project.iam.gserviceaccount.com
# Important: keep newlines – if pasting one line, escape as \n
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n"
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

The API will be running at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env.local` (see `frontend/.env.local.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Firebase Web App config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

4. Start the development server:
```bash
npm run dev
```

The app will be running at `http://localhost:3000`

Note: For local development use `npm run dev`. The `npm start` script runs `next start` which requires a production build (`npm run build`) to exist.

## 🔐 Security Features

1. **Password Hashing**: Using bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based auth with expiration
3. **Protected Routes**: Middleware validates tokens on protected endpoints
4. **Input Validation**: Server-side validation on all inputs
5. **CORS Configuration**: Restricted origins in production
6. **Error Handling**: No sensitive data leaked in error responses

## 📊 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/password` | Update password | Yes |
| GET | `/api/tasks` | Get all tasks | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| POST | `/api/tasks` | Create task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |
| GET | `/api/tasks/stats` | Get task statistics | Yes |

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API docs.

## 🧪 Testing the API

Import the Postman collection from `postman_collection.json` or test manually:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📈 Scalability

See [SCALABILITY.md](./SCALABILITY.md) for detailed documentation on how to scale this application for production.

## 🎨 UI/UX Features

- Fully responsive design (mobile, tablet, desktop)
- Loading states and skeleton screens
- Toast notifications for user feedback
- Form validation with inline error messages
- Intuitive navigation with active states
- Dark-friendly color palette

## 📝 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Axios
- React Hook Form
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- Firebase Firestore (Firebase Admin SDK)
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

## 📄 License

This project is built for the Judix Full-Stack Developer Intern Assignment.

## 👤 Author

Built with ❤️ for the Judix recruitment process.
