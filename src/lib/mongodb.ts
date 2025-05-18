import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO!;

if (!MONGODB_URI) throw new Error("MongoDB URI is not defined");

export async function connectToDB() {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
