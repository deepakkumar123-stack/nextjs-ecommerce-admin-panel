// lib/db.ts - Mongoose Connection Utility (Cleaned Version)

import mongoose, { ConnectOptions } from "mongoose";

// Use the non-null assertion operator (!) since we check for existence below
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log("Using cached Mongoose connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: ConnectOptions = {
      bufferCommands: false, // Recommended for serverless environments
    };

    cached.promise = mongoose
      .connect(MONGODB_URI || "", opts)
      .then((mongoose) => {
        console.log("New Mongoose connection established.");
        return mongoose;
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

export default dbConnect;
