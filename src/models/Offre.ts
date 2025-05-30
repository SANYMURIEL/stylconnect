import mongoose from 'mongoose';

const OffreSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['stage', 'emploi'], 
    required: true
  },
  datePublication: { type: Date, required: true, default: Date.now },
  statut: {
    type: String,
    enum: ['approuve', 'en attente'],
    default: 'en attente',
  },
  idRecruteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export const Offre = mongoose.models.Offre || mongoose.model('Offre', OffreSchema);