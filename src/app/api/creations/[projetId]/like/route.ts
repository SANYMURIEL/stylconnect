// app/api/creations/[projetId]/like/route.ts
import { connectToDB } from '@/lib/mongodb';
import { Projet } from '@/models/Projet';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Assurez-vous que le chemin est correct

export async function POST(req: Request, { params }: { params: { projetId: string } }) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { projetId } = params;

    if (!userId) {
        return NextResponse.json({ message: 'Vous devez être connecté pour liker.' }, { status: 401 });
    }

    if (!projetId) {
        return NextResponse.json({ message: 'ID du projet invalide.' }, { status: 400 });
    }

    try {
        await connectToDB();
        const projet = await Projet.findById(projetId);
        if (!projet) {
            return NextResponse.json({ message: 'Projet non trouvé.' }, { status: 404 });
        }

        const alreadyLiked = projet.likesBy?.includes(userId);
        if (!alreadyLiked) {
            await Projet.findByIdAndUpdate(projetId, { $inc: { likes: 1 }, $push: { likesBy: userId } });
            return NextResponse.json({ message: 'Like ajouté !' });
        } else {
            return NextResponse.json({ message: 'Vous avez déjà liké ce projet.' }, { status: 400 });
        }

    } catch (error) {
        console.error('Erreur lors de la gestion du like:', error);
        return NextResponse.json({ message: 'Erreur serveur lors de la gestion du like.' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { projetId: string } }) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { projetId } = params;

    if (!userId) {
        return NextResponse.json({ message: 'Vous devez être connecté pour liker.' }, { status: 401 });
    }

    if (!projetId) {
        return NextResponse.json({ message: 'ID du projet invalide.' }, { status: 400 });
    }

    try {
        await connectToDB();
        const projet = await Projet.findById(projetId);
        if (!projet) {
            return NextResponse.json({ message: 'Projet non trouvé.' }, { status: 404 });
        }

        const alreadyLiked = projet.likesBy?.includes(userId);
        if (alreadyLiked) {
            await Projet.findByIdAndUpdate(projetId, { $inc: { likes: -1 }, $pull: { likesBy: userId } });
            return NextResponse.json({ message: 'Like retiré.' });
        } else {
            return NextResponse.json({ message: 'Vous n\'avez pas encore liké ce projet.' }, { status: 400 });
        }

    } catch (error) {
        console.error('Erreur lors de la gestion du like:', error);
        return NextResponse.json({ message: 'Erreur serveur lors de la gestion du like.' }, { status: 500 });
    }
}