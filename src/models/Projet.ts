// models/Projet.ts (ou le nom de votre fichier de modèle)
import mongoose from 'mongoose';

const projetSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  media: {
    type: String,
    required: true,
  },
  auteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  statut: {
    type: String,
    enum: ['en_attente', 'approuve', 'refuse'],
    default: 'en_attente',
  },
  // Champs pour les likes
  likesBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [], // Le tableau doit être initialisé comme vide
  },
  likes: {
    type: Number,
    default: 0, // Le compteur de likes doit être initialisé à 0
  },
}, { timestamps: true });

export const Projet = mongoose.models.Projet || mongoose.model('Projet', projetSchema);