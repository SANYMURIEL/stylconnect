
import { connectToDB } from "@/lib/mongodb";
import { Actualite } from "@/models/Actualites";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const actualites = await Actualite.find().sort({ datePublication: -1 });
    return NextResponse.json(actualites, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des actualités:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const { titre, description, media } = await request.json();

    if (!titre || !description) {
      return new NextResponse("Le titre et la description sont requis", {
        status: 400,
      });
    }

    await connectToDB();
    const nouvelleActualite = new Actualite({ titre, description, media });
    const savedActualite = await nouvelleActualite.save();
    console.log("Actualité enregistrée dans MongoDB:", savedActualite);
    return NextResponse.json(savedActualite, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'actualité:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};
