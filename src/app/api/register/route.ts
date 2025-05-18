

import { registerUser } from "@/controllers/authController";

type ErrorResponse = {
  message: string;
};

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const user = await registerUser(data);
    return new Response(JSON.stringify(user), { status: 201 });
  } catch (err) {
    const error = err as ErrorResponse;
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
