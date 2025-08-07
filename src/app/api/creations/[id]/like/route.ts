// app/api/creations/[id]/like/route.ts
import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { Projet } from '@/models/Projet';
import mongoose from 'mongoose';

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectToDB();
    const { id } = context.params;
    const { userId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'ID de projet ou d\'utilisateur invalide.' }, { status: 400 });
    }

    const projet = await Projet.findByIdAndUpdate(
      id,
      { $addToSet: { likesBy: userId } }, // Ajoute l'userId s'il n'existe pas déjà
      { new: true, runValidators: true }
    );

    if (!projet) {
      return NextResponse.json({ message: 'Projet non trouvé.' }, { status: 404 });
    }

    // Recalcule le nombre de likes
    projet.likes = projet.likesBy.length;
    await projet.save();

    return NextResponse.json({ message: 'Like ajouté avec succès.', projet });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un like:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur.' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectToDB();
    const { id } = context.params;
    const { userId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'ID de projet ou d\'utilisateur invalide.' }, { status: 400 });
    }

    const projet = await Projet.findByIdAndUpdate(
      id,
      { $pull: { likesBy: userId } }, // Retire l'userId du tableau
      { new: true, runValidators: true }
    );

    if (!projet) {
      return NextResponse.json({ message: 'Projet non trouvé.' }, { status: 404 });
    }

    // Recalcule le nombre de likes
    projet.likes = projet.likesBy.length;
    await projet.save();

    return NextResponse.json({ message: 'Like supprimé avec succès.', projet });
  } catch (error) {
    console.error('Erreur lors de la suppression d\'un like:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur.' }, { status: 500 });
  }
}