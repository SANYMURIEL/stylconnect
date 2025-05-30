// app/api/recruteur/offres/route.ts
import { connectToDB } from "@/lib/mongodb";
import { Offre } from "@/models/Offre";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "recruteur") {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    await connectToDB();
    const offres = await Offre.find({ idRecruteur: session.user.id }).sort({ datePublication: -1 });
    return NextResponse.json(offres, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des offres:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "recruteur") {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const { titre, description, type } = await request.json();

    if (!titre || !description || !type) {
      return new NextResponse("Le titre, la description et le type sont requis", {
        status: 400,
      });
    }

    await connectToDB();
    const nouvelleOffre = new Offre({
      titre,
      description,
      type,
      idRecruteur: session.user.id,
    });
    const savedOffre = await nouvelleOffre.save();
    console.log("Offre enregistrée dans MongoDB:", savedOffre);
    return NextResponse.json(savedOffre, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'offre:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
};