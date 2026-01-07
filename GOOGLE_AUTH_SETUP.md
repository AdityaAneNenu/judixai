# Google Authentication Setup Guide

## Firebase Configuration Complete ✅

Google authentication has been added to your app! Follow these steps to complete the setup:

## Step 1: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **judixai**
3. In the left sidebar, click **Build** → **Authentication**
4. Click **Get started**
5. Click on the **Sign-in method** tab
6. Click on **Google** in the providers list
7. Toggle **Enable**
8. Enter your project support email
9. Click **Save**

## Step 2: Get Firebase Web App Config

1. In Firebase Console, click the gear icon ⚙️ → **Project settings**
2. Scroll down to **Your apps** section
3. If you don't have a web app yet:
   - Click the **Web** icon (`</>`)
   - Register app with nickname (e.g., "Judix Web App")
   - Click **Register app**
4. Copy the `firebaseConfig` object values

## Step 3: Update Frontend Environment Variables

Open `frontend/.env.local` and replace these values with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=judixai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=judixai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=judixai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-actual-app-id
```

You can find these values in:
- Firebase Console → Project Settings → General → Your apps → Web app

## What's Been Added

### Backend Changes:
- ✅ Added `POST /api/auth/google` endpoint
- ✅ Google ID token verification using Firebase Admin SDK
- ✅ Automatic user creation for new Google sign-ins
- ✅ JWT token generation for authenticated users

### Frontend Changes:
- ✅ Installed Firebase client SDK
- ✅ Firebase config file at `src/lib/firebase.ts`
- ✅ Google sign-in button on login page
- ✅ Google sign-in button on register page
- ✅ Automatic redirect to dashboard after Google auth
- ✅ Token storage and auth context integration

## How It Works

1. User clicks "Sign in with Google" button
2. Firebase popup opens for Google account selection
3. User selects Google account and grants permissions
4. Firebase returns ID token
5. Frontend sends ID token to backend `/api/auth/google`
6. Backend verifies token with Firebase Admin SDK
7. Backend creates/finds user in Firestore
8. Backend returns JWT token
9. Frontend stores token and redirects to dashboard

## Testing

1. Start your backend server:
   ```bash
   cd backend
   node server.js
   ```

2. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Visit http://localhost:3000/login
4. Click "Sign in with Google"
5. Select your Google account
6. You should be redirected to the dashboard!

## Troubleshooting

**"Unauthorized domain" error:**
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add `localhost` to the authorized domains list

**"Invalid API key" error:**
- Double-check your Firebase config values in `.env.local`
- Make sure you copied all values correctly

**Backend errors:**
- Ensure Firebase Admin SDK is properly configured in `backend/.env`
- Check that the backend server is running

## Security Notes

- Never commit `.env` or `.env.local` files to version control
- Keep your Firebase API keys secure
- The API key is safe for client-side use (Firebase validates with domain restrictions)
- Backend verifies all tokens before creating/authenticating users
