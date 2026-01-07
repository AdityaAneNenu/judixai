const admin = require('firebase-admin');

const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      return admin.firestore();
    }

    // Get Firebase credentials from environment
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Validate required environment variables
    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing required Firebase environment variables. Please check your .env file.');
    }

    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });

    console.log('Firebase initialized successfully');
    return admin.firestore();
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    process.exit(1);
  }
};

const db = initializeFirebase();

module.exports = { db, admin };
