import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    await connectToDB();
    const users = await User.find().select("-password");
    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Failed to fetch users" }), { status: 500 });
  }
};

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    await connectToDB();
    const body = await req.json();

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = new User({ ...body, password: hashedPassword });

    await newUser.save();
    return NextResponse.json(newUser);
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Failed to create user" }), { status: 500 });
  }
};
