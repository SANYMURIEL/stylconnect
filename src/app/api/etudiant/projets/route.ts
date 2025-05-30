import { connectToDB } from "@/lib/mongodb";
import { Projet } from "@/models/Projet";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const projets = await Projet.find().sort({ dateCreation: -1 }).populate('auteurId', 'username'); // Peupler le nom d'utilisateur de l'auteur
    return NextResponse.json(projets, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const { titre, description, media, auteurId } = await request.json();

    if (!titre || !auteurId) {
      return new NextResponse("Le titre et l'ID de l'auteur sont requis", {
        status: 400,
      });
    }

    await connectToDB();
    const nouveauProjet = new Projet({ titre, description, media, auteurId });
    const savedProjet = await nouveauProjet.save();
    console.log("Projet enregistré dans MongoDB:", savedProjet);
    return NextResponse.json(savedProjet, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};