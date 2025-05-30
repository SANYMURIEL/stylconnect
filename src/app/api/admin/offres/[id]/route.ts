// app/api/admin/offres/[id]/route.ts
import { connectToDB } from "@/lib/mongodb";
import { Offre } from "@/models/Offre";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Assurez-vous que ce chemin est correct

interface RouteParams {
    id: string;
}

/**
 * @route GET /api/admin/offres/[id]
 * @description Récupère une offre spécifique par ID pour l'admin.
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
        const offre = await Offre.findById(id).populate('idRecruteur'); // Populate pour les détails du recruteur
        if (!offre) {
            return new NextResponse("Offre non trouvée", { status: 404 });
        }

        return NextResponse.json(offre, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'offre (Admin):", error);
        return new NextResponse("Erreur interne du serveur", { status: 500 });
    }
};

/**
 * @route PUT /api/admin/offres/[id]
 * @description Permet à un administrateur de modifier une offre (y compris son statut).
 * @access Admin
 */
export const PUT = async (
    request: Request,
    { params }: { params: RouteParams }
) => {
    const { id } = params;
    // Récupère toutes les données envoyées, y compris le statut
    const { titre, description, type, statut, idRecruteur } = await request.json();

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
        if (type !== undefined) updateFields.type = type;
        if (statut !== undefined) updateFields.statut = statut; // L'admin peut modifier le statut
        if (idRecruteur !== undefined) updateFields.idRecruteur = idRecruteur; // L'admin peut modifier le recruteur

        const updatedOffre = await Offre.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true } // Retourne le document mis à jour et exécute les validateurs de schéma
        );

        if (!updatedOffre) {
            return new NextResponse("Offre non trouvée", { status: 404 });
        }

        return NextResponse.json(updatedOffre, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'offre (Admin):", error);
        return new NextResponse("Erreur interne du serveur", { status: 500 });
    }
};

/**
 * @route DELETE /api/admin/offres/[id]
 * @description Permet à un administrateur de supprimer une offre.
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
        const deletedOffre = await Offre.findByIdAndDelete(id);

        if (!deletedOffre) {
            return new NextResponse("Offre non trouvée", { status: 404 });
        }

        return new NextResponse(null, { status: 204 }); // Succès, pas de contenu à renvoyer
    } catch (error) {
        console.error("Erreur lors de la suppression de l'offre (Admin):", error);
        return new NextResponse("Erreur interne du serveur", { status: 500 });
    }
};
