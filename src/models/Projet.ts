// models/Projet.ts
import mongoose from 'mongoose';

const ProjetSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String }, // Le champ description est maintenant ici et n'est pas requis
    dateCreation: { type: Date, default: Date.now },
    media: { type: String }, // URL du média (Cloudinary)
    auteurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: { type: Number, default: 0 },
    likesBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Ajout de ce champ pour suivre les likes par utilisateur
    statut: {
        type: String,
        enum: ['approuve', 'en attente'],
        default: 'en attente',
    },
}, { timestamps: true });

export const Projet = mongoose.models.Projet || mongoose.model('Projet', ProjetSchema);