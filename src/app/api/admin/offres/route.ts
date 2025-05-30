// app/api/admin/offres/route.ts
import { connectToDB } from "@/lib/mongodb";
import { Offre } from "@/models/Offre";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Assurez-vous que ce chemin est correct

/**
 * @route GET /api/admin/offres
 * @description Récupère toutes les offres. Peut filtrer par statut.
 * @access Admin
 */
export const GET = async (request: Request) => {
    try {
        const session = await getServerSession(authOptions);
        // Vérifie si l'utilisateur est un administrateur
        if (!session?.user?.id || session.user.role !== "admin") {
            return new NextResponse(JSON.stringify({ message: "Accès non autorisé" }), { status: 401 });
        }

        await connectToDB(); // Connexion à la base de données

        const { searchParams } = new URL(request.url);
        const statut = searchParams.get('statut'); // Récupère le paramètre de statut (ex: ?statut=en attente)

        const query: { statut?: string } = {};
        if (statut) {
            query.statut = statut;
        }

        // Récupère toutes les offres ou les offres filtrées par statut
        // Populate 'idRecruteur' pour obtenir les détails du recruteur si nécessaire
        const offres = await Offre.find(query).populate('idRecruteur').sort({ datePublication: -1 });

        return NextResponse.json(offres, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération des offres (Admin):", error);
        return new NextResponse("Erreur interne du serveur", { status: 500 });
    }
};

/**
 * @route POST /api/admin/offres
 * @description Permet à un administrateur d'ajouter une nouvelle offre.
 * L'admin doit spécifier l'idRecruteur.
 * @access Admin
 */
export const POST = async (request: Request) => {
    try {
        const session = await getServerSession(authOptions);
        // Vérifie si l'utilisateur est un administrateur
        if (!session?.user?.id || session.user.role !== "admin") {
            return new NextResponse(JSON.stringify({ message: "Accès non autorisé" }), { status: 401 });
        }

        const { titre, description, type, idRecruteur } = await request.json();

        // Validation des champs requis
        if (!titre || !description || !type || !idRecruteur) {
            return new NextResponse("Le titre, la description, le type et l'ID du recruteur sont requis", {
                status: 400,
            });
        }

        await connectToDB(); // Connexion à la base de données

        // Création de la nouvelle offre avec le statut 'en attente' par défaut
        const nouvelleOffre = new Offre({
            titre,
            description,
            type,
            idRecruteur, // L'admin peut spécifier le recruteur
            statut: 'en attente', // Statut par défaut
        });
        const savedOffre = await nouvelleOffre.save();

        console.log("Offre enregistrée dans MongoDB par l'admin:", savedOffre);
        return NextResponse.json(savedOffre, { status: 201 });
    } catch (error) {
        console.error("Erreur lors de la création de l'offre (Admin):", error);
        return new NextResponse("Erreur interne du serveur", { status: 500 });
    }
};
