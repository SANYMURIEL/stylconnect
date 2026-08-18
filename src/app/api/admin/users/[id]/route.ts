import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export const PUT = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  await connectToDB();

  const { password, ...rest } = body;
  const updateData = { ...rest };

  if (password) {
    const bcrypt = await import("bcryptjs");
    updateData.password = await bcrypt.hash(password, 10);
  }

  const user = await User.findByIdAndUpdate(id, updateData, { new: true });
  return NextResponse.json(user);
};

export const DELETE = async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  await connectToDB();
  await User.findByIdAndDelete(id);
  return NextResponse.json({ message: "Supprimé" });
};
