// app/api/sendEmail/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
// Correction du chemin d'importation : Utilisation d'un chemin relatif
import EmailTemplate from '../../../components/EmailTemplate';
import { ReactElement } from 'react';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'Adresse e-mail invalide.' }, { status: 400 });
    }

    // Vérification des variables d'environnement
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error('Erreur: Les variables d\'environnement GMAIL_USER ou GMAIL_PASS ne sont pas définies.');
      return NextResponse.json(
        { message: 'Configuration du serveur de messagerie manquante.', error: 'Missing environment variables' },
        { status: 500 }
      );
    }

    console.log(`Nouvel abonné à la newsletter: ${email}`);
    // Ici, vous devriez normalement enregistrer l'e-mail dans une base de données
    // pour suivre vos abonnés et éviter les doublons.
    // database.saveNewsletterSubscriber(email); // Exemple d'intégration BDD

    // Configuration de Nodemailer avec les variables d'environnement
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Rend le template React Email en HTML
    const emailHtml = await render(EmailTemplate({ email }) as ReactElement);

    // Envoi du mail
    await transporter.sendMail({
      from: process.env.GMAIL_USER, // Utilise directement l'adresse GMAIL_USER comme expéditeur
      to: email,
      subject: 'Bienvenue chez Styl\'Connect - Confirmez votre inscription à la newsletter',
      html: emailHtml,
    });

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    let errorMessage = 'Une erreur est survenue lors de l\'envoi de l\'e-mail.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: 'Error sending email', error: errorMessage }, { status: 500 });
  }
}
