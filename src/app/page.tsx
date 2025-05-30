
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroImage from "../../public/images/essai.png";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "react-feather"; // Import de l'icône

interface Actualite {
  _id: string;
  titre: string;
  description: string;
  media?: string;
  datePublication: string;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
};

const sectionVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { delayChildren: 0.2, staggerChildren: 0.1 },
  },
};

const titleVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const loadingErrorVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0 },
};

export default function HomePage() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [selectedActualite, setSelectedActualite] = useState<Actualite | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActualites = async () => {
    try {
      const res = await fetch("/api/admin/actualites");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setActualites(data);
      setSelectedActualite(data[0] || null);
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActualites();
  }, []);

  const handleActualiteClick = (actu: Actualite) => {
    setSelectedActualite(actu);
  };

  return (
    <>
      <Navbar />
      <motion.main
        className="bg-gradient-to-b from-pink-50 to-white min-h-screen"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.8, ease: "easeInOut" },
        }}
      >
        {/* Hero Section (comme avant) */}
                <section className="py-16 md:py-24 lg:py-32 px-6 md:px-12 lg:px-20">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <motion.div
              className="text-center md:text-left space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.7, ease: "easeInOut" },
              }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Laissez l'inspiration{" "}
                <span className="text-pink-600">éclore</span> à Styl’Connect
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                La vitrine où la créativité des étudiants du{" "}
                <strong>CFPD</strong> prend vie. Découvrez, partagez,
                inspirez-vous.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 pt-4">
                <a
                  href="/galerie"
                  className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-pink-700 transition-colors duration-300 shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057-2.018 8-7.542 8-5.52 0-8.792-3.943-7.518-8z"
                    />
                  </svg>{" "}
                  Explorer les créations
                </a>
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-6 py-3 rounded-full text-base font-medium hover:bg-pink-200 transition-colors duration-300 shadow-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>{" "}
                  Rejoindre la communauté
                </a>
              </div>
            </motion.div>

            <motion.div
              className="w-full md:w-[480px] lg:w-[560px] mx-auto"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.7, ease: "easeInOut" },
              }}
            >
              <motion.div
                className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
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
        </section>

        {/* Actualités Section (mise à jour) */}
        <section className="py-12 px-6 md:px-12 lg:px-20 bg-pink-50">
          <div className="max-w-6xl mx-auto rounded-xl bg-white shadow-lg overflow-hidden">
            <div className="p-8">
              <motion.h2
                className="text-2xl font-bold text-pink-600 mb-6 text-center"
                variants={titleVariants}
                initial="initial"
                animate="animate"
              >
                Dernières Actualités
              </motion.h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Actualité Principale (Gauche) */}
                <div className="lg:order-1">
                  <AnimatePresence>
                    {loading && (
                      <motion.p
                        className="text-center text-gray-500"
                        variants={loadingErrorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
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
                      >
                        Erreur: {error}
                      </motion.p>
                    )}
                    {!loading && selectedActualite && (
                      <motion.div
                        key={selectedActualite._id}
                        className="rounded-md overflow-hidden shadow-md"
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
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
                </div>

                {/* Liste des Actualités (Droite) */}
                <div className="lg:order-2 space-y-4">
                  <AnimatePresence>
                    {!loading &&
                      !error &&
                      actualites.map((actu) => (
                        <motion.div
                          key={actu._id}
                          className="bg-pink-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer flex items-center overflow-hidden"
                          variants={cardVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          onClick={() => handleActualiteClick(actu)}
                        >
                          {actu.media && (
                            <div className="w-24 h-20 relative overflow-hidden rounded-l-md">
                              <img
                                src={actu.media}
                                alt={actu.titre}
                                className="object-cover w-full h-full"
                                fill
                              />
                            </div>
                          )}
                          <div className="p-3">
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
                    <div className="text-right mt-4">
                      <a
                        href="/actualites"
                        className="inline-flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-600 transition-colors duration-200"
                      >
                        Toutes les actualités
                        <ArrowRight className="w-4 h-4" />{" "}
                        {/* Utilisation de React Icon */}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.main>
      <Footer />
    </>
  );
}