import { connectToDB } from "@/lib/mongodb";
    import { User } from "@/models/User";
    import bcrypt from 'bcryptjs';

    export async function registerUser(data: { name: string; email: string; password: string }) {
      await connectToDB();
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new Error("Un utilisateur avec cet email existe déjà.");
      }
      const hashed = await bcrypt.hash(data.password, 10);
      const user = new User({ name: data.name, email: data.email, password: hashed });
      await user.save();
      return user;
    }