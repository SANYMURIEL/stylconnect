// app/api/offres/route.ts
import { connectToDB } from '@/lib/mongodb'; // Assurez-vous que le chemin est correct
import { Offre } from '@/models/Offre';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDB();
    const offres = await Offre.find({ statut: 'approuve' }).populate('idRecruteur', 'name');
    return NextResponse.json(offres);
  } catch (error) {console.error("Erreur lors de la récupération des offres:", error);
    return NextResponse.json({ message: 'Erreur lors de la récupération des offres.' }, { status: 500 });
  }
}