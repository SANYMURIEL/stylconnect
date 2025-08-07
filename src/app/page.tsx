"use client"; // Nécessaire pour les hooks React et Framer Motion

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroImage from "../../public/images/essai.png";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

// Importation des icônes de React Icons
import {
  FaEye,
  FaUserPlus,
  FaLink,
  FaLightbulb,
  FaArrowRight,
} from "react-icons/fa";

// Interface pour les actualités
interface Actualite {
  _id: string;
  titre: string;
  description: string;
  media?: string;
  datePublication: string;
}

// --- Variants d'animation (améliorés) ---

// Animation pour l'entrée générale des sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

// Animation pour les éléments individuels à l'intérieur des sections
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Variants pour les cartes (actualités, pourquoi Styl'Connect)
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
  hover: { scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)", transition: { duration: 0.3 } },
  tap: { scale: 0.98 },
};

// Variants pour les titres de section
const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Variants pour les messages de chargement/erreur
const loadingErrorVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0 },
};

// Variante pour les boutons
const buttonVariants = {
  initial: { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
  hover: {
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.95, boxShadow: "0px 2px 5px rgba(0,0,0,0.2)" },
};

// Variants pour les icônes de la section "Pourquoi Styl'Connect ?"
const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 10 },
  },
  hover: { rotate: 10, scale: 1.1, transition: { duration: 0.2 } },
};

export default function HomePage() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [selectedActualite, setSelectedActualite] = useState<Actualite | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les actualités depuis l'API
  const fetchActualites = async () => {
    try {
      const res = await fetch("/api/admin/actualites");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setActualites(data);
      // Sélectionne la première actualité par default si disponible
      setSelectedActualite(data[0] || null);
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  // Lance la récupération des actualités au chargement du composant
  useEffect(() => {
    fetchActualites();
  }, []);

  // Gère le clic sur une actualité pour l'afficher en principal
  const handleActualiteClick = (actu: Actualite) => {
    setSelectedActualite(actu);
  };

  // Nouvelle fonction pour gérer la soumission de la newsletter, passée au composant enfant
  const handleNewsletterSubmit = async (email: string) => {
    console.log(`Tentative d'abonnement à la newsletter pour: ${email}`);
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur de l'API d'envoi d'e-mail:", errorData.message);
        throw new Error(errorData.message || "Échec de l'envoi de l'e-mail.");
      }

      const data = await response.json();
      console.log("Réponse de l'API d'envoi d'e-mail:", data.message);
      // Pas besoin de retourner quoi que ce soit ici, le composant enfant gérera le succès.
    } catch (err: any) {
      console.error("Erreur lors de la soumission de la newsletter:", err);
      throw err; // Propage l'erreur pour que NewsletterForm puisse la gérer
    }
  };

  return (
    <div className="bg-pink-50 min-h-screen flex flex-col">
      <Navbar /> {/* Barre de navigation */}
      <motion.main
        className="flex-grow"
        initial="hidden"
        animate="visible"
        variants={sectionVariants} // Animation globale d'entrée
      >
        {/* Section Hero */}
        <motion.section
          className="py-16 md:py-24 lg:py-32 px-6 md:px-12 lg:px-20 overflow-hidden" // Ajout overflow-hidden
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <motion.div
              className="text-center md:text-left space-y-8"
              variants={itemVariants} // Utilise itemVariants pour le texte
            >
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
                variants={itemVariants}
              >
                Laissez l'inspiration{" "}
                <span className="text-pink-600">éclore</span> à Styl’Connect
              </motion.h1>
              <motion.p
                className="text-lg sm:text-xl text-gray-700 leading-relaxed"
                variants={itemVariants}
              >
                La vitrine où la créativité des étudiants du{" "}
                <strong>CFPD</strong> prend vie. Découvrez, partagez,
                inspirez-vous.
              </motion.p>
              <motion.div
                className="flex flex-wrap justify-center md:justify-start items-center gap-4 pt-4"
                variants={itemVariants}
              >
                <motion.a
                  href="/creations"
                  className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-pink-700 transition-colors duration-300 shadow-md"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaEye className="w-5 h-5" /> {/* Icône React Icons */}
                  Explorer les créations
                </motion.a>
                <motion.a
                  href="/register"
                  className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-6 py-3 rounded-full text-base font-medium hover:bg-pink-200 transition-colors duration-300 shadow-sm"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaUserPlus className="w-5 h-5" /> {/* Icône React Icons */}
                  Rejoindre la communauté
                </motion.a>
              </motion.div>
            </motion.div>

            <motion.div
              className="w-full md:w-[480px] lg:w-[560px] mx-auto"
              variants={itemVariants} // Utilise itemVariants pour l'image
            >
              <motion.div
                className="relative rounded-xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Image
                  src={HeroImage}
                  alt="Illustration Styl'Connect"
                  className="w-full h-auto object-cover transition-transform duration-500"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section Actualités (avec un nouvel effet de fondu) */}
        <motion.section
          className="py-12 px-6 md:px-12 lg:px-20 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-6xl mx-auto rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <motion.h2
                className="text-2xl font-bold text-pink-600 mb-6 text-center"
                variants={titleVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                Dernières Actualités
              </motion.h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Actualité Principale (Gauche) */}
                <motion.div className="lg:order-1" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                  <AnimatePresence mode="wait">
                    {loading && (
                      <motion.p
                        className="text-center text-gray-500"
                        variants={loadingErrorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key="loading"
                      >
                        Chargement...
                      </motion.p>
                    )}
                    {error && (
                      <motion.p
                        className="text-center text-red-500"
                        variants={loadingErrorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key="error"
                      >
                        Erreur: {error}
                      </motion.p>
                    )}
                    {!loading && selectedActualite && (
                      <motion.div
                        key={selectedActualite._id}
                        className="rounded-md overflow-hidden shadow-md cursor-pointer"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover="hover"
                        onClick={() => handleActualiteClick(selectedActualite)}
                      >
                        {selectedActualite.media && (
                          <div className="aspect-w-16 aspect-h-9">
                            <img
                              src={selectedActualite.media}
                              alt={selectedActualite.titre}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                            {selectedActualite.titre}
                          </h3>
                          <p className="text-gray-700 text-sm mb-3 line-clamp-4">
                            {selectedActualite.description}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {new Date(
                              selectedActualite.datePublication
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Liste des Actualités (Droite) */}
                <motion.div className="lg:order-2 space-y-4" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                  <AnimatePresence>
                    {!loading &&
                      !error &&
                      actualites.map((actu) => (
                        <motion.div
                          key={actu._id}
                          className="bg-pink-50 rounded-md shadow-sm flex items-center overflow-hidden cursor-pointer"
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover="hover"
                          onClick={() => handleActualiteClick(actu)}
                        >
                          {actu.media && (
                            <div className="w-24 h-20 relative overflow-hidden rounded-l-md flex-shrink-0">
                              <img
                                src={actu.media}
                                alt={actu.titre}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                          <div className="p-3 flex-grow">
                            <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                              {actu.titre}
                            </h4>
                            <p className="text-gray-500 text-xs">
                              {new Date(
                                actu.datePublication
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                  {!loading && !error && (
                    <motion.div className="text-right mt-4" variants={itemVariants}>
                      <Link
                        href="/actualites"
                        className="inline-flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-600 transition-colors duration-200"
                        passHref
                      >
                        Toutes les actualités
                        <FaArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Pourquoi Styl'Connect ? - Section améliorée */}
        <motion.section
          className="py-12 px-6 md:px-12 lg:px-20 bg-gray-50"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-6xl mx-auto text-center py-8">
            <motion.h2
              className="text-3xl sm:text-4xl font-extrabold text-pink-600 mb-12"
              variants={titleVariants}
            >
              Pourquoi choisir Styl'Connect ?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Carte 1: Connectivité */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className="p-4 bg-pink-100 rounded-full mb-4"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <FaLink className="w-12 h-12 text-pink-500" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Connectivité Sans Limite
                </h3>
                <p className="text-gray-600 text-base">
                  Rejoignez une communauté dynamique d'étudiants créatifs et de
                  professionnels passionnés. Échangez des idées, collaborez et
                  bâtissez votre réseau.
                </p>
              </motion.div>

              {/* Carte 2: Vitrine de Talents */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className="p-4 bg-pink-100 rounded-full mb-4"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <FaEye className="w-12 h-12 text-pink-500" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Mettez Votre Talent en Lumière
                </h3>
                <p className="text-gray-600 text-base">
                  Exposez vos projets et créations uniques à un public large et
                  ciblé. Obtenez de la reconnaissance et des opportunités
                  professionnelles.
                </p>
              </motion.div>

              {/* Carte 3: Inspiration Continue */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className="p-4 bg-pink-100 rounded-full mb-4"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <FaLightbulb className="w-12 h-12 text-pink-500" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Source d'Inspiration Quotidienne
                </h3>
                <p className="text-gray-600 text-base">
                  Explorez une galerie riche et variée des dernières tendances
                  et innovations du CFPD. Laissez-vous inspirer et développez
                  vos compétences.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Section Newsletter - Maintenant avec un arrière-plan blanc */}
        <section className="py-12 px-6 md:px-12 lg:px-20 bg-white">
          <NewsletterForm onSubmit={handleNewsletterSubmit} />
        </section>
      </motion.main>
      {/* Le Footer prend maintenant la couleur et l'ombre précédemment sur la newsletter */}
      <Footer />
    </div>
  );
}