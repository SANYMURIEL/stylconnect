import transporter from '@/lib/nodemailer';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Vérification de l'authentification et du rôle
  if (!session || session.user.role !== 'etudiant') {
    return res.status(403).json({ error: 'Accès non autorisé' });
  }
  
  if (req.method !== 'POST') return res.status(405).end();

  const { to, subject, text, html } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur d\'envoi d\'email:', error);
    res.status(500).json({ error: 'Échec de l\'envoi' });
  }
}
