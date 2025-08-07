// components/NewsletterForm.tsx
"use client"; // Necessary for React hooks and Framer Motion

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"; // Ajout de nouvelles icônes
import Image from "next/image"; // Import Next.js Image component

interface NewsletterFormProps {
  onSubmit: (email: string) => Promise<void>; // Ensure return type is Promise<void>
}

// Variants for Framer Motion animations
const formContainerVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.2 } },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const titleVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 }
};

const NewsletterForm: React.FC<NewsletterFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setMessage("Veuillez entrer une adresse e-mail valide.");
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setMessage(null); // Clear previous messages

    try {
      // Calls the onSubmit function passed by the parent (HomePage)
      await onSubmit(email);
      setMessage("Veuillez vérifier vos e-mails pour confirmer votre inscription. 🎉");
      setIsSuccess(true);
      setEmail(""); // Clear input after successful submission
    } catch (error) {
      console.error('Error during form submission:', error);
      setMessage("Une erreur est survenue lors de l'inscription. Veuillez réessayer. 😢");
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
      // Optional: Reset message after a certain time
      setTimeout(() => setMessage(null), 7000);
    }
  };

  return (
    <motion.div
      // RETIRÉ : 'bg-pink-100 rounded-xl shadow-xl' d'ici
      // La newsletter prend maintenant le fond blanc de la section parente.
      className="max-w-5xl mx-auto py-8 px-4 md:py-10 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-8"
      variants={formContainerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.5 }}
    >
      {/* Form Section (Left) */}
      <div className="lg:w-1/2 p-6 flex flex-col justify-center text-center lg:text-left">
        <FaEnvelope className="w-16 h-16 text-pink-600 mx-auto lg:mx-0 mb-5 drop-shadow-md" />
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight"
          variants={titleVariants}
        >
          Restez Connecté : <span className="text-pink-700">Abonnez-vous</span> à notre Newsletter !
        </motion.h2>
        <p className="text-md text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
          Ne manquez aucune de nos dernières créations, événements et actualités du CFPD. Recevez l'inspiration directement dans votre boîte de réception.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <div className="relative w-full sm:flex-1">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="email"
              id="email"
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-3 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 text-gray-800 placeholder-gray-500 text-base shadow-sm"
              aria-label="Votre adresse e-mail"
            />
          </div>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-base font-medium transition-colors duration-300 shadow-md whitespace-nowrap
              ${isSubmitting ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-pink-600 text-white hover:bg-pink-700 active:bg-pink-800'}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin text-white">🔄</span> Envoi...
              </>
            ) : (
              <>
                S'abonner <FaPaperPlane className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
        <AnimatePresence mode="wait">
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 font-semibold text-center text-sm flex items-center justify-center gap-2
                ${isSuccess ? 'text-green-600' : 'text-red-600'}`}
            >
              {isSuccess ? <FaCheckCircle className="text-lg" /> : <FaExclamationCircle className="text-lg" />}
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Image Section (Right) */}
      <div className="lg:w-1/2 flex items-center justify-center p-4">
        <Image
          src="/images/new2.png" // Assurez-vous que le chemin est correct et que l'image est optimisée
          alt="Person inviting to join the newsletter"
          width={500} // Ajustez la largeur pour une meilleure résolution ou un meilleur ajustement
          height={350} // Ajustez la hauteur proportionnellement
          className="rounded-lg object-contain w-full h-auto drop-shadow-lg" // Utiliser h-auto pour éviter le déformation
          priority
        />
      </div>
    </motion.div>
  );
};

export default NewsletterForm;