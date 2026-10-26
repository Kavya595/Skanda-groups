import mongoose from 'mongoose';

// Disable query buffering so operations fail immediately or fallback cleanly if MongoDB is not connected
mongoose.set('bufferCommands', false);

let cachedConnection = null;
let lastAttemptTime = 0;
const RETRY_INTERVAL_MS = 15000;

export async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const now = Date.now();
  if (lastAttemptTime && (now - lastAttemptTime) < RETRY_INTERVAL_MS) {
    return null;
  }
  lastAttemptTime = now;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skandha_brundavan';

  try {
    cachedConnection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Connected to database: ${mongoose.connection.name}`);
    return cachedConnection;
  } catch (error) {
    console.warn('[MongoDB] Notice: Could not connect to MongoDB (' + error.message + '). Running in resilient in-memory fallback mode.');
    return null;
  }
}

