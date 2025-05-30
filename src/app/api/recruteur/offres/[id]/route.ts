// app/api/recruteur/offres/[id]/route.ts
import { connectToDB } from "@/lib/mongodb";
import { Offre } from "@/models/Offre";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface RouteParams {
  id: string;
}

// Récupérer une offre par ID
export const GET = async (
  request: Request,
  { params }: { params: RouteParams }
) => {
  const { id } = params;
  try {
    await connectToDB();
    const offre = await Offre.findById(id);
    if (!offre) {
      return new NextResponse("Offre non trouvée", { status: 404 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || offre.idRecruteur.toString() !== session.user.id) {
      return new NextResponse("Non autorisé à voir cette offre", { status: 403 });
    }

    return NextResponse.json(offre, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'offre:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};

// Modifier une offre par ID
export const PUT = async (
  request: Request,
  { params }: { params: RouteParams }
) => {
  const { id } = params;
  const { titre, description, type } = await request.json();

  if (!titre || !description || !type) {
    return new NextResponse("Le titre, la description et le type sont requis", { status: 400 });
  }

  try {
    await connectToDB();
    const offreToUpdate = await Offre.findById(id);

    if (!offreToUpdate) {
      return new NextResponse("Offre non trouvée", { status: 404 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || offreToUpdate.idRecruteur.toString() !== session.user.id) {
      return new NextResponse("Non autorisé à modifier cette offre", { status: 403 });
    }

    const updatedOffre = await Offre.findByIdAndUpdate(
      id,
      { titre, description, type },
      { new: true } // Retourne le document mis à jour
    );

    if (!updatedOffre) {
      return new NextResponse("Offre non trouvée", { status: 404 });
    }

    return NextResponse.json(updatedOffre, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'offre:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};

// Supprimer une offre par ID
export const DELETE = async (
  request: Request,
  { params }: { params: RouteParams }
) => {
  const { id } = params;
  try {
    await connectToDB();
    const offreToDelete = await Offre.findById(id);

    if (!offreToDelete) {
      return new NextResponse("Offre non trouvée", { status: 404 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || offreToDelete.idRecruteur.toString() !== session.user.id) {
      return new NextResponse("Non autorisé à supprimer cette offre", { status: 403 });
    }

    const deletedOffre = await Offre.findByIdAndDelete(id);

    if (!deletedOffre) {
      return new NextResponse("Offre non trouvée", { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // Succès, pas de contenu à renvoyer
  } catch (error) {
    console.error("Erreur lors de la suppression de l'offre:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};