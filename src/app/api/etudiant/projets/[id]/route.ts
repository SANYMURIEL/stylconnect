import { connectToDB } from "@/lib/mongodb";
import { Projet } from "@/models/Projet";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    await connectToDB();
    const projet = await Projet.findById(id).populate('auteurId', 'username'); // Peupler le nom d'utilisateur de l'auteur
    if (!projet) {
      return new NextResponse("Projet non trouvé", { status: 404 });
    }
    return NextResponse.json(projet, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};

export const PUT = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { titre, description, media, statut } = await request.json(); // Ajoutez la description ici

  if (!titre) {
    return new NextResponse("Le titre est requis", { status: 400 });
  }

  try {
    await connectToDB();
    const updatedProjet = await Projet.findByIdAndUpdate(
      id,
      { titre, description, media, statut }, // Incluez la description dans la mise à jour
      { new: true }
    );

    if (!updatedProjet) {
      return new NextResponse("Projet non trouvé", { status: 404 });
    }

    return NextResponse.json(updatedProjet, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    await connectToDB();
    const deletedProjet = await Projet.findByIdAndDelete(id);

    if (!deletedProjet) {
      return new NextResponse("Projet non trouvé", { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // Succès, pas de contenu à renvoyer
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};