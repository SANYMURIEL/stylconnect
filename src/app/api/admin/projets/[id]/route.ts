import { connectToDB } from "@/lib/mongodb";
import { Projet } from "@/models/Projet";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Assurez-vous que ce chemin est correct

interface RouteParams {
    id: string;
}

/**
 * @route GET /api/admin/projets/[id]
 * @description Récupère un projet spécifique par ID pour l'admin.
 * @access Admin
 */
export const GET = async (
    request: Request,
    { params }: { params: RouteParams }
) => {
    const { id } = params;
    try {
        const session = await getServerSession(authOptions);
        // Vérifie si l'utilisateur est un administrateur
        if (!session?.user?.id || session.user.role !== "admin") {
            return new NextResponse(JSON.stringify({ message: "Accès non autorisé" }), { status: 401 });
        }

        await connectToDB(); // Connexion à la base de données
        const projet = await Projet.findById(id).populate('auteurId'); // Populate pour les détails de l'auteur
        if (!projet) {
            return new NextResponse("Projet non trouvé", { status: 404 });
        }

        return NextResponse.json(projet, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération du projet (Admin):", error);
        return new NextResponse("Erreur interne du serveur", { status: 500 });
    }
};

/**
 * @route PUT /api/admin/projets/[id]
 * @description Permet à un administrateur de modifier un projet (y compris son statut).
 * @access Admin
 */
export const PUT = async (
    request: Request,
    { params }: { params: RouteParams }
) => {
    const { id } = params;
    // Récupère toutes les données envoyées, y compris le statut
    const { titre, description, media, statut, auteurId, likes } = await request.json();

    try {
        const session = await getServerSession(authOptions);
        // Vérifie si l'utilisateur est un administrateur
        if (!session?.user?.id || session.user.role !== "admin") {
            return new NextResponse(JSON.stringify({ message: "Accès non autorisé" }), { status: 401 });
        }

        await connectToDB(); // Connexion à la base de données

        // Construire l'objet de mise à jour dynamiquement
        const updateFields: any = {};
        if (titre !== undefined) updateFields.titre = titre;
        if (description !== undefined) updateFields.description = description;
        if (media !== undefined) updateFields.media = media;
        if (statut !== undefined) updateFields.statut = statut; // L'admin peut modifier le statut
        if (auteurId !== undefined) updateFields.auteurId = auteurId; // L'admin peut modifier l'auteur
        if (likes !== undefined) updateFields.likes = likes; // L'admin peut modifier les likes

        const updatedProjet = await Projet.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true } // Retourne le document mis à jour et exécute les validateurs de schéma
        );

        if (!updatedProjet) {
            return new NextResponse("Projet non trouvé", { status: 404 });
        }

        return NextResponse.json(updatedProjet, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du projet (Admin):", error);
        return new NextResponse("Erreur interne du serveur", { status: 500 });
    }
};

/**
 * @route DELETE /api/admin/projets/[id]
 * @description Permet à un administrateur de supprimer un projet.
 * @access Admin
 */
export const DELETE = async (
    request: Request,
    { params }: { params: RouteParams }
) => {
    const { id } = params;
    try {
        const session = await getServerSession(authOptions);
        // Vérifie si l'utilisateur est un administrateur
        if (!session?.user?.id || session.user.role !== "admin") {
            return new NextResponse(JSON.stringify({ message: "Accès non autorisé" }), { status: 401 });
        }

        await connectToDB(); // Connexion à la base de données
        const deletedProjet = await Projet.findByIdAndDelete(id);

        if (!deletedProjet) {
            return new NextResponse("Projet non trouvé", { status: 404 });
        }

        return new NextResponse(null, { status: 204 }); // Succès, pas de contenu à renvoyer
    } catch (error) {
        console.error("Erreur lors de la suppression du projet (Admin):", error);
        return new NextResponse("Erreur interne du serveur", { status: 500 });
    }
};