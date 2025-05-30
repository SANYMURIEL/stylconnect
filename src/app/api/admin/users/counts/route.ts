// app/api/admin/users/counts/route.ts
import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDB();

    const etudiantCount = await User.countDocuments({ role: 'etudiant' });
    const recruteurCount = await User.countDocuments({ role: 'recruteur' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    return NextResponse.json({ etudiant: etudiantCount, recruteur: recruteurCount, admin: adminCount }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des comptes d'utilisateurs:", error);
    return NextResponse.json({ message: "Erreur lors de la récupération des comptes d'utilisateurs." }, { status: 500 });
  }
}