// app/components/EmailTemplate.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Img, // Img est toujours importé mais non utilisé pour le logo texte
  Tailwind,
  Section,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface EmailTemplateProps {
  email: string;
  logoBase64?: string; // Prop pour la donnée Base64 de l'image (maintenue au cas où, mais non utilisée pour le logo texte)
}

const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';

export const EmailTemplate = ({ email, logoBase64 }: EmailTemplateProps) => (
  <Html>
    <Head />
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              pink: {
                50: '#FDF2F8',
                100: '#FCE7F6',
                200: '#FBCFE8',
                300: '#F9A8D4',
                400: '#F472B6',
                500: '#EC4899', // Votre rose principal
                600: '#DB2777',
                700: '#BE185D',
                800: '#9D174D',
                900: '#831843',
              },
              gray: { // Ajout de nuances de gris pour plus de contraste et de modernité
                50: '#F9FAFB',
                100: '#F3F4F6',
                200: '#E5E7EB',
                300: '#D1D5DB',
                400: '#9CA3AF',
                500: '#6B7280',
                600: '#4B5563',
                700: '#374151',
                800: '#1F2937',
                900: '#111827',
              },
            },
          },
        },
      }}
    >
      <Body className="bg-gray-50 font-sans leading-relaxed text-gray-800">
        <Container className="my-8 mx-auto max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">

          {/* Header Section - Solid Pink Background, Enhanced Clarity */}
          {/* Couleur rose unie (pink-700) pour un excellent contraste avec le texte blanc */}
          {/* py-8 réduit l'espace vertical du header */}
          <Section className="bg-pink-700 py-8 px-6 text-center rounded-t-xl">
            {/* Titre principal - Couleur blanche pour une visibilité maximale */}
            <Text className="text-4xl font-extrabold leading-tight mb-3 text-white">
              Bienvenue dans la communauté <span className="text-pink-100">Styl'Connect</span> !
            </Text>
            {/* Texte d'introduction - Couleur blanche et opacité retirée pour une clarté maximale */}
            <Text className="text-lg max-w-md mx-auto text-white">
              Nous sommes ravis de vous compter parmi nos abonnés passionnés.
            </Text>
            <Hr className="border-t border-pink-300 w-1/3 mx-auto mt-6" /> {/* Séparateur élégant */}
          </Section>

          {/* Main Content Section */}
          <Section className="p-8">
            <Text className="text-lg mb-4">
              Merci de vous être abonné à notre newsletter avec l'adresse e-mail :
              {/* L'adresse email est bien en rose (text-pink-600) */}
              <strong className="text-pink-600"> {email}</strong>.
            </Text>
            <Text className="mb-6">
              Préparez-vous à recevoir une dose quotidienne d'inspiration, directement dans votre boîte de réception. Nous sommes impatients de partager avec vous les dernières créations de nos talentueux étudiants du CFPD et des mises à jour sur nos événements excitants.
            </Text>

            {/* "What to Expect" Section - Enhanced with subtle border and icon-like feel */}
            <Section className="mt-8 mb-6 bg-pink-50 rounded-lg p-6 border-l-4 border-pink-500 shadow-sm">
              <Text className="text-xl font-bold text-pink-700 mb-3">
                ✨ Ce qui vous attend dans nos prochaines éditions :
              </Text>
              <ul className="list-disc list-inside text-gray-700 pl-4">
                <li><Text className="inline mb-1">Des **projets innovants** et des portfolios éblouissants.</Text></li>
                <li><Text className="inline mb-1">Les **actualités clés** et les événements phares du CFPD.</Text></li>
              </ul>
              <Text className="text-center mt-6 text-gray-700">
                L'inspiration est à portée de clic !
              </Text>
              {/* Le lien "Découvrez nos dernières actualités ici !" ne renvoie à rien pour l'instant */}
              <Link
                href="#"
                className="text-pink-600 text-base font-medium mt-4 inline-block text-center w-full"
              >
                Découvrez nos dernières actualités ici !
              </Link>
            </Section>

            <Hr className="border-t border-gray-200 my-8" />

            {/* Footer Section - Clean and Elegant */}
            {/* Applique la couleur de fond pink-700 et ajuste la couleur du texte à blanc */}
            <Section className="bg-pink-700 py-6 px-6 text-center rounded-b-xl">
              <Text className="mb-2 text-white">
                Une question ? Une idée ? N'hésitez pas à nous contacter.
              </Text>
              <Text className="font-semibold mb-2 text-white">
                L'équipe Styl'Connect
              </Text>
              {/* Le lien "Visiter notre site" ne renvoie à rien pour l'instant */}
              <Link href="#" className="text-pink-100 text-sm"> {/* Utilise pink-100 pour un léger contraste sur le fond rose foncé */}
                Visitez notre site
              </Link>
              <Text className="mt-4 text-pink-200 text-xs"> {/* Utilise pink-200 pour le copyright */}
                © {new Date().getFullYear()} Styl'Connect. Tous droits réservés.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default EmailTemplate;
