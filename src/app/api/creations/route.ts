// app/api/creations/route.ts
import { connectToDB } from '@/lib/mongodb';
import { Projet } from '@/models/Projet';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectToDB();

        const projets = await Projet.find({ statut: 'approuve' })
            .populate('auteurId', 'name')
            .lean();

        const formattedProjets = projets.map(projet => {
            const likesBy = projet.likesBy?.map(id => id.toString()) || [];
            return {
                ...projet,
                likesBy: likesBy,
                likes: likesBy.length,
            };
        });

        return NextResponse.json(formattedProjets);
    } catch (error) {
        console.error("Erreur lors de la récupération des créations:", error);
        return NextResponse.json({ message: 'Erreur lors de la récupération des créations.' }, { status: 500 });
    }
}