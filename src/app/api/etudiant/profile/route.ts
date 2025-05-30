// app/api/etudiant/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User"; // Assurez-vous que votre modèle User est correctement importé

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);

    // Vérifier si l'utilisateur est authentifié et a le rôle 'etudiant'
    if (!session?.user?.id || session.user.role !== "etudiant") {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    await connectToDB();

    // Récupérer le profil de l'utilisateur connecté
    // Exclure le mot de passe pour des raisons de sécurité
    const userProfile = await User.findById(session.user.id).select("-password");

    if (!userProfile) {
      return new NextResponse(JSON.stringify({ message: "User profile not found" }), { status: 404 });
    }

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return new NextResponse(JSON.stringify({ message: "Failed to fetch student profile" }), { status: 500 });
  }
};