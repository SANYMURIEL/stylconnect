
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlinePlus } from "react-icons/ai";
import { FaEye, FaUser } from "react-icons/fa";
import { Offre as OffreModel } from "@/models/Offre";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from 'next/navigation'; // Import useRouter

interface OffreWithRecruteurName extends OffreModel {
  recruteurName?: string;
}

const ITEMS_PER_PAGE = 8;

const OffresPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [allOffres, setAllOffres] = useState<OffreWithRecruteurName[]>([]);
  const [filteredOffres, setFilteredOffres] = useState<
    OffreWithRecruteurName[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOffre, setSelectedOffre] =
    useState<OffreWithRecruteurName | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = session?.user?.id;
  const userRoles = session?.user?.role || [];
  const isEtudiantOrAdmin =
    userRoles.includes("etudiant") || userRoles.includes("admin");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "emploi" | "stage">(
    "all"
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=" + window.location.pathname); // Redirige vers la page de connexion
    }
  }, [status, router]);

  const fetchOffres = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/offres");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const offresWithRecruteurName = data.map(
        (offre: OffreWithRecruteurName) => ({
          ...offre,
          recruteurName: offre.idRecruteur?.name || "Inconnu",
        })
      );
      setAllOffres(offresWithRecruteurName);
    } catch (e: any) {
      console.error("Erreur lors de la récupération des offres:", e);
      setError("Impossible de charger les offres.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchOffres();
    }
  }, [fetchOffres, status]);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredOffres(allOffres);
    } else {
      setFilteredOffres(
        allOffres.filter((offre) => offre.type === activeFilter)
      );
    }
    setCurrentPage(1); // Reset page on filter change
  }, [allOffres, activeFilter]);

  const openModal = (offre: OffreWithRecruteurName) => {
    setSelectedOffre(offre);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedOffre(null);
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  const titleVariants = {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const modalVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalContentVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    exit: { scale: 0.95, opacity: 0 },
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOffres = filteredOffres.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredOffres.length / ITEMS_PER_PAGE);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  //envoi email
  const handlePostuler = async () => {
    if (!selectedOffre || !session?.user) return;
  
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedOffre.idRecruteur.email,
          subject: `Nouvelle candidature pour ${selectedOffre.titre}`,
          html: `
            <h1>Nouvelle candidature</h1>
            <p>Étudiant: ${session.user.name}</p>
            <p>Email: ${session.user.email}</p>
            <p>Offre: ${selectedOffre.titre}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          `
        })
      });
  
      if (!response.ok) throw new Error('Échec de l\'envoi');
      alert('Candidature envoyée avec succès !');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'envoi de la candidature');
    }
  };
  

  // Rendu conditionnel basé sur l'état de l'authentification
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-xl text-pink-500 font-semibold animate-pulse">
          Chargement... ✨
        </p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-lg text-gray-700 mb-4">
          Vous devez être connecté pour voir les offres.
        </p>
        {/* Vous pouvez ajouter un bouton de connexion ici si vous le souhaitez */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar className="sticky top-0 z-10" />
      <motion.div
        className="py-12 md:py-16 container mx-auto px-4 sm:px-6 lg:px-8 flex-grow mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <section className="mb-8 text-center">
          <motion.h1
            className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 tracking-tight"
            variants={titleVariants}
            initial="initial"
            animate="animate"
          >
            Découvrez nos offres
          </motion.h1>
          <p className="text-lg text-gray-600">
            Explorez les opportunités disponibles.
          </p>
        </section>

        <div className="mb-6 flex justify-center space-x-4">
          <button
            className={`py-2 px-4 rounded-md text-sm font-semibold ${
              activeFilter === "all"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700 hover:bg-pink-100 border border-pink-300"
            } focus:outline-none focus:ring-2 focus:ring-pink-500`}
            onClick={() => setActiveFilter("all")}
          >
            Toutes
          </button>
          <button
            className={`py-2 px-4 rounded-md text-sm font-semibold ${
              activeFilter === "emploi"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700 hover:bg-pink-100 border border-pink-300"
            } focus:outline-none focus:ring-2 focus:ring-pink-500`}
            onClick={() => setActiveFilter("emploi")}
          >
            Emploi
          </button>
          <button
            className={`py-2 px-4 rounded-md text-sm font-semibold ${
              activeFilter === "stage"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700 hover:bg-pink-100 border border-pink-300"
            } focus:outline-none focus:ring-2 focus:ring-pink-500`}
            onClick={() => setActiveFilter("stage")}
          >
            Stage
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-xl text-pink-500 font-semibold animate-pulse">
              Chargement des offres... ✨
            </p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-500 font-semibold">Erreur : {error}</p>
          </div>
        ) : (
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentOffres.map((offre) => (
                <motion.div
                  key={offre._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-pink-200 hover:shadow-lg transition duration-200 ease-in-out"
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  onClick={() => openModal(offre)}
                >
                  <div className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-md font-semibold text-gray-800 mb-2 line-clamp-2">
                        {offre.titre}
                      </h3>
                      <p className="text-sm text-gray-500 italic flex items-center mb-1">
                        <FaUser className="mr-2 text-pink-400" />
                        Recruteur :
                        <span className="text-pink-500 font-medium">
                          {offre.recruteurName}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Type:{" "}
                        <span className="font-semibold">{offre.type}</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        className="flex items-center text-gray-600 hover:text-blue-500 focus:outline-none text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(offre);
                        }}
                      >
                        <FaEye className="mr-1 text-blue-400" />
                        <span className="text-gray-700">Voir</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 py-4 bg-white rounded-md shadow-sm flex justify-center space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`py-2 px-4 rounded-md text-sm ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-pink-100 text-gray-700 hover:bg-pink-200 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  }`}
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`py-2 px-4 rounded-md text-sm font-medium ${
                        currentPage === page
                          ? "bg-pink-500 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                          : "bg-white text-gray-700 hover:bg-pink-100 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`py-2 px-4 rounded-md text-sm ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-pink-100 text-gray-700 hover:bg-pink-200 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  }`}
                >
                  Suivant
                </button>
              </div>
            )}
          </section>
        )}

        <AnimatePresence>
          {isModalOpen && selectedOffre && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={closeModal}
            >
              <motion.div
                className="relative z-10 w-11/12 md:max-w-lg rounded-xl bg-white shadow-lg border border-gray-200 overflow-auto max-h-[90vh]"
                variants={modalContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h2 className="text-lg font-semibold text-pink-600 flex items-center">
                    <AiOutlinePlus className="mr-2 text-pink-500" /> Détail de
                    l'Offre
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-1 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedOffre.titre}
                  </h2>
                  <p className="text-gray-700">{selectedOffre.description}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Type:{" "}
                    <span className="font-semibold">{selectedOffre.type}</span>
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <FaUser className="mr-2 text-pink-400" /> Recruteur:
                    <span className="font-medium text-pink-500">
                      {selectedOffre.recruteurName}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Publiée le:{" "}
                    {new Date(
                      selectedOffre.datePublication!
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Statut:{" "}
                    <span className="font-semibold">
                      {selectedOffre.statut}
                    </span>
                  </p>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={closeModal}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-pink-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    Fermer
                  </button>
                  {isEtudiantOrAdmin && (
                    <button
                      onClick={handlePostuler}
                      className="inline-flex items-center rounded-md border border-pink-300 bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      Postuler
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Footer />
    </div>
  );
};

export default OffresPage;