"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface Actualite {
  _id: string;
  titre: string;
  description: string;
  media?: string;
  datePublication: string;
}

const cardVariants = {
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
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

const TailwindLoader = () => (
  <div className="flex justify-center items-center py-10">
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  </div>
);

export default function ActualitesPage() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isHovering = useRef(false);

  const fetchActualites = async () => {
    try {
      const res = await fetch("/api/admin/actualites");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setActualites(data);
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActualites();
  }, []);

  useEffect(() => {
    if (!loading && actualites.length > 0) {
      const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % actualites.length);
      };

      const startInterval = () => {
        intervalRef.current = setInterval(() => {
          if (!isHovering.current) {
            nextSlide();
          }
        }, 3000); // Change slide every 3 seconds
      };

      const stopInterval = () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      startInterval();

      return () => stopInterval(); // Cleanup on unmount
    }
  }, [loading, actualites.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? actualites.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % actualites.length);
  };

  return (
    <>
      <Navbar />
      <motion.main
        className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-12"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.8, ease: "easeInOut" },
        }}
      >
        <section className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto py-16">
          <motion.h1
            className="text-3xl font-extrabold text-center text-pink-700 mb-8"
            variants={titleVariants}
            initial="initial"
            animate="animate"
          >
            L'Actualité en Mouvement du{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              CFPD
            </span>
          </motion.h1>

          <AnimatePresence>
            {loading && <TailwindLoader />}
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
            {!loading && !error && actualites.length > 0 && (
              <div className="relative bg-white">
                <div
                  ref={sliderRef}
                  className="overflow-hidden relative rounded-lg shadow-md"
                  onMouseEnter={() => (isHovering.current = true)}
                  onMouseLeave={() => (isHovering.current = false)}
                >
                  <motion.div
                    className="flex"
                    style={{
                      transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {actualites.map((actu, index) => (
                      <motion.div
                        key={actu._id}
                        className="w-full flex-shrink-0 p-6 md:p-8 lg:p-10"
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                          {actu.media && (
                            <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden">
                              <img
                                src={actu.media}
                                alt={actu.titre}
                                className="object-cover w-full h-full"
                                fill
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="text-2xl font-semibold text-pink-700 mb-4">
                              {actu.titre}
                            </h3>
                            <p className="text-gray-700 text-lg">
                              {actu.description}
                            </p>
                            <span className="text-gray-500 text-sm mt-4 block">
                              Publié le{" "}
                              {new Date(
                                actu.datePublication
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                {actualites.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full shadow-md p-2 text-pink-500 hover:text-pink-700 transition-colors duration-200 z-10"
                    >
                      <IoChevronBackOutline size={30} />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full shadow-md p-2 text-pink-500 hover:text-pink-700 transition-colors duration-200 z-10"
                    >
                      <IoChevronForwardOutline size={30} />
                    </button>
                  </>
                )}
              </div>
            )}
          </AnimatePresence>

          {/* Section de mise en avant (optionnelle) */}
          {!loading && !error && actualites.length > 0 && (
            <motion.div
              className="mt-12 py-8 bg-pink-50 rounded-lg shadow-sm"
              variants={sectionVariants}
              initial="initial"
              animate="animate"
            >
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-xl font-semibold text-pink-700 mb-4">
                  Ne manquez aucune de nos actualités !
                </h2>
                <p className="text-gray-600 mb-6">
                  Restez informé des dernières nouveautés et des événements
                  importants du CFPD.
                </p>
                {/* Vous pourriez ajouter ici un formulaire de newsletter */}
              </div>
            </motion.div>
          )}
        </section>
      </motion.main>
      <Footer />
    </>
  );
}
