import mongoose from 'mongoose';

export async function connectToDB() {
  if (mongoose.connections[0].readyState) return;

  const MONGODB_URI = process.env.MONGO || process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MongoDB URI is not defined. Please set MONGO or MONGODB_URI in your .env.local file.");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

