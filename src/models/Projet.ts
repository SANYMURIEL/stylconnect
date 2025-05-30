import mongoose from 'mongoose';

const ProjetSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now },
  media: { type: String }, // URL du média (Cloudinary)
  auteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: { type: Number, default: 0 },
  statut: {
    type: String,
    enum: ['approuve', 'en attente'],
    default: 'en attente',
  },
}, { timestamps: true });

export const Projet = mongoose.models.Projet || mongoose.model('Projet', ProjetSchema);