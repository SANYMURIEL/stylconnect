
import mongoose from 'mongoose';

const ActualiteSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  media: { type: String }, // URL ou chemin vers l'image/vidéo
  datePublication: { type: Date, default: Date.now },
}, { timestamps: true });

export const Actualite = mongoose.models.Actualite || mongoose.model("Actualite", ActualiteSchema);