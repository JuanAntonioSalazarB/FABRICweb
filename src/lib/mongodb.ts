import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  // If no database URI is defined, we'll fall back to a mock or log warning.
  // In production, MONGODB_URI is required.
  console.warn('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global namespace to store connection promise in development
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const cached = global.mongoose as MongooseCache;

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    return null;
  }
  
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Fail fast (5s instead of 30s) to trigger mock fallback quickly if IP is blocked
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('Connected to MongoDB successfully.');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
