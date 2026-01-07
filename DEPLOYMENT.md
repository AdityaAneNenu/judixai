# Vercel Deployment Guide

This project is configured for deployment on Vercel with integrated backend API routes.

## Project Structure

The backend has been converted to Vercel serverless functions located in the `frontend/api` directory:

```
frontend/
├── api/
│   ├── auth/
│   │   ├── register.js
│   │   ├── login.js
│   │   ├── me.js
│   │   ├── profile.js
│   │   ├── password.js
│   │   └── google.js
│   ├── tasks/
│   │   ├── index.js
│   │   ├── [id].js
│   │   └── stats.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   └── middleware/
│       ├── auth.js
│       └── validate.js
├── src/
├── public/
├── vercel.json
└── package.json
```

## Deployment Steps

### 1. Prepare Your Project

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables

Before deploying, set up your environment variables in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or import it first)
3. Go to Settings → Environment Variables
4. Add the following variables:

```
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
```

**Important**: For `FIREBASE_PRIVATE_KEY`, make sure to:
- Keep the quotes around the entire value
- Include the `\n` characters for line breaks
- Keep the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` headers

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

Install Vercel CLI:
```bash
npm i -g vercel
```

Login to Vercel:
```bash
vercel login
```

Deploy:
```bash
vercel
```

For production deployment:
```bash
vercel --prod
```

#### Option B: Using GitHub Integration

1. Push your code to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Set the root directory to `frontend`
6. Vercel will auto-detect Next.js and configure build settings
7. Add environment variables in the project settings
8. Click "Deploy"

### 4. Verify Deployment

After deployment, your API endpoints will be available at:

```
https://your-app.vercel.app/api/auth/register
https://your-app.vercel.app/api/auth/login
https://your-app.vercel.app/api/auth/me
https://your-app.vercel.app/api/auth/profile
https://your-app.vercel.app/api/auth/password
https://your-app.vercel.app/api/auth/google
https://your-app.vercel.app/api/tasks
https://your-app.vercel.app/api/tasks/stats
https://your-app.vercel.app/api/tasks/:id
```

Test your API:
```bash
curl https://your-app.vercel.app/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Local Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

API routes will work locally at:
- `http://localhost:3000/api/auth/*`
- `http://localhost:3000/api/tasks/*`

## Troubleshooting

### Firebase Authentication Issues
- Verify your Firebase credentials are correct
- Make sure `FIREBASE_PRIVATE_KEY` includes proper line breaks (`\n`)
- Check that your Firebase project has Firestore enabled

### API Route Not Found
- Ensure `vercel.json` is in the frontend root directory
- Check that API files are in the `api/` directory
- Verify file names match the route paths

### Environment Variables Not Working
- Environment variables must be set in Vercel Dashboard
- After adding new env vars, redeploy the project
- For local dev, use `.env.local` file

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check that all required packages are in `package.json` dependencies (not devDependencies)
- Verify Node.js version compatibility

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Firebase Firestore database created and configured
- [ ] Firebase Admin SDK credentials added
- [ ] JWT_SECRET is a strong, random string
- [ ] CORS origins updated if needed
- [ ] Frontend API base URL points to production domain
- [ ] Test all API endpoints after deployment
- [ ] Monitor Vercel function logs for errors

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
