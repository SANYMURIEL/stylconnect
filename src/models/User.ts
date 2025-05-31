import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  image: String,
  role: {
    type: String,
    enum: ['etudiant', 'recruteur', 'admin'],
    default: 'recruteur',
  },

  // Champs spécifiques à chaque rôle
  bio: { type: String }, // Pour etudiant
  derniereConnexion: { type: Date }, // Pour admin

  typeEntreprise: { type: String }, // Pour entreprise
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
