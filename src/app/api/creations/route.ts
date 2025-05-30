// app/api/creations/route.ts
import { connectToDB } from '@/lib/mongodb'; // Assurez-vous que le chemin est correct
// app/api/creations/route.ts

import { Projet } from '@/models/Projet';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectToDB();
        const projets = await Projet.find({ statut: 'approuve' }).populate('auteurId', 'name');
        return NextResponse.json(projets);
    } catch (error) {
        console.error("Erreur lors de la récupération des créations:", error);
        return NextResponse.json({ message: 'Erreur lors de la récupération des créations.' }, { status: 500 });
    }
}