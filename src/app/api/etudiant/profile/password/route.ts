// app/api/etudiant/profile/password/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    // Vérifier si l'utilisateur est authentifié et a le rôle 'etudiant'
    if (!session?.user?.id || session.user.role !== "etudiant") {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    await connectToDB();

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return new NextResponse(JSON.stringify({ message: "Ancien et nouveau mot de passe requis" }), { status: 400 });
    }

    const user = await User.findById(session.user.id);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Utilisateur non trouvé" }), { status: 404 });
    }

    // Vérifier l'ancien mot de passe
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password!);

    if (!isPasswordCorrect) {
      return new NextResponse(JSON.stringify({ message: "L'ancien mot de passe est incorrect" }), { status: 400 });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = hashedPassword;
    await user.save();

    return new NextResponse(JSON.stringify({ message: "Mot de passe mis à jour avec succès" }), { status: 200 });

  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error);
    return new NextResponse(JSON.stringify({ message: "Erreur lors du changement de mot de passe" }), { status: 500 });
  }
};