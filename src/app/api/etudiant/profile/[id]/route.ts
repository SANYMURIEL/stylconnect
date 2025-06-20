// app/api/etudiant/profile/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User"; // Assurez-vous que votre modèle User est correctement importé

interface RouteParams {
  id: string; // L'ID de l'utilisateur à modifier, passé dans l'URL
}

export const PUT = async (req: Request, { params }: { params: RouteParams }) => {
  const { id } = params; // Récupère l'ID de l'utilisateur depuis les paramètres de l'URL

  try {
    const session = await getServerSession(authOptions);

    // Vérifier si l'utilisateur est authentifié, est un etudiant ET s'il tente de modifier son propre profil
    if (!session?.user?.id || session.user.role !== "etudiant" || session.user.id !== id) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    await connectToDB();

    const body = await req.json();
    // Nous ne voulons pas permettre la modification du mot de passe ou de l'email via cette route PUT classique
    // Le mot de passe a sa propre route dédiée
    const { password, email, typeEntreprise, ...rest } = body; // Exclure les champs non pertinents pour l'étudiant

    // Les champs que vous voulez permettre de mettre à jour via ce formulaire pour un étudiant
    const updateData: {
      name?: string;
      bio?: string;
      // Ajoutez d'autres champs spécifiques à l'étudiant si nécessaire
    } = {};

    if (rest.name !== undefined) updateData.name = rest.name;
    if (rest.bio !== undefined) updateData.bio = rest.bio;

    // Mise à jour de l'utilisateur dans la base de données
    // new: true pour retourner le document mis à jour
    // select("-password") pour ne pas renvoyer le hash du mot de passe
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

    if (!updatedUser) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error updating student profile:", error);
    return new NextResponse(JSON.stringify({ message: "Failed to update student profile" }), { status: 500 });
  }
};