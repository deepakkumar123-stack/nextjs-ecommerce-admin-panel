// types/global.d.ts

import { Mongoose } from "mongoose";

// Define the structure of your Mongoose cache object
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend the Node.js global interface to include your cached property
declare global {
  var mongoose: MongooseCache;
}

// Ensure the file is treated as a module
export {};
