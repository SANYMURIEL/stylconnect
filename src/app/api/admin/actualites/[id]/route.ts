

import { connectToDB } from "@/lib/mongodb";
import { Actualite } from "@/models/Actualites";
import { NextResponse } from "next/server";


export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    await connectToDB();
    const actualite = await Actualite.findById(id);
    if (!actualite) {
      return new NextResponse("Actualité non trouvée", { status: 404 });
    }
    return NextResponse.json(actualite, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'actualité:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};

// Modifier une actualité par ID
export const PUT = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { titre, description, media } = await request.json();

  if (!titre || !description) {
    return new NextResponse("Le titre et la description sont requis", { status: 400 });
  }

  try {
    await connectToDB();
    const updatedActualite = await Actualite.findByIdAndUpdate(
      id,
      { titre, description, media },
      { new: true } 
    );

    if (!updatedActualite) {
      return new NextResponse("Actualité non trouvée", { status: 404 });
    }

    return NextResponse.json(updatedActualite, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'actualité:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};

// Supprimer une actualité par ID
export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    await connectToDB();
    const deletedActualite = await Actualite.findByIdAndDelete(id);

    if (!deletedActualite) {
      return new NextResponse("Actualité non trouvée", { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // Succès, pas de contenu à renvoyer
  } catch (error) {
    console.error("Erreur lors de la suppression de l'actualité:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};