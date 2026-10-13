import mongoose from 'mongoose';

let cachedConnection = null;

export async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skandha_brundavan';

  try {
    cachedConnection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected to database: ${mongoose.connection.name}`);
    return cachedConnection;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error.message);
    if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    return null;
  }
}

