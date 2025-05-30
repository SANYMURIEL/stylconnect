import { connectToDB } from "@/lib/mongodb";
import { Projet } from "@/models/Projet";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Assurez-vous que ce chemin est correct

/**
 * @route GET /api/admin/projets
 * @description Récupère tous les projets. Peut filtrer par statut.
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

        // Récupère tous les projets ou les projets filtrés par statut
        // Populate 'auteurId' pour obtenir les détails de l'auteur si nécessaire
        const projets = await Projet.find(query).populate('auteurId').sort({ dateCreation: -1 });

        return NextResponse.json(projets, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération des projets (Admin):", error);
        return new NextResponse("Erreur interne du serveur", { status: 500 });
    }
};

/**
 * @route POST /api/admin/projets
 * @description Permet à un administrateur d'ajouter un nouveau projet.
 * L'admin doit spécifier l'auteurId.
 * @access Admin
 */
export const POST = async (request: Request) => {
    try {
        const session = await getServerSession(authOptions);
        // Vérifie si l'utilisateur est un administrateur
        if (!session?.user?.id || session.user.role !== "admin") {
            return new NextResponse(JSON.stringify({ message: "Accès non autorisé" }), { status: 401 });
        }

        const { titre, description, media, auteurId } = await request.json();

        // Validation des champs requis
        if (!titre || !auteurId) {
            return new NextResponse("Le titre et l'ID de l'auteur sont requis", {
                status: 400,
            });
        }

        await connectToDB(); // Connexion à la base de données

        // Création du nouveau projet avec le statut 'en attente' par défaut
        const nouveauProjet = new Projet({
            titre,
            description,
            media,
            auteurId, // L'admin peut spécifier l'auteur
            statut: 'en attente', // Statut par défaut
        });
        const savedProjet = await nouveauProjet.save();

        console.log("Projet enregistré dans MongoDB par l'admin:", savedProjet);
        return NextResponse.json(savedProjet, { status: 201 });
    } catch (error) {
        console.error("Erreur lors de la création du projet (Admin):", error);
        return new NextResponse("Erreur interne du serveur", { status: 500 });
    }
};