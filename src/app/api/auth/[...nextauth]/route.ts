import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials) {
    throw new Error("Identifiants manquants");
  }
        await connectToDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Utilisateur non trouvé");

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Mot de passe incorrect");
        return { id: user._id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
  
   async session({ session, token }) {
    if (session.user && token.sub) {
      (session.user as { id: string }).id = token.sub;
    }
    return session;
  },
  
  },
});

export { handler as GET, handler as POST };
