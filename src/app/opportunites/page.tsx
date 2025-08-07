// app/offres/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaEye, FaUser, FaSearch } from "react-icons/fa";
import { Offre as OffreModel } from "@/models/Offre";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from 'next/navigation';

interface OffreWithRecruteurName extends OffreModel {
  recruteurName?: string;
}

const ITEMS_PER_PAGE = 8;

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-20 text-pink-500">
    <motion.div
      className="text-4xl"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <AiOutlineLoading3Quarters />
    </motion.div>
  </div>
);

const OffresPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [allOffres, setAllOffres] = useState<OffreWithRecruteurName[]>([]);
  const [filteredOffres, setFilteredOffres] = useState<OffreWithRecruteurName[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOffre, setSelectedOffre] = useState<OffreWithRecruteurName | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userRoles = session?.user?.role || [];
  const isEtudiantOrAdmin = userRoles.includes("etudiant") || userRoles.includes("admin");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "emploi" | "stage">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=" + window.location.pathname);
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
    let currentFiltered = allOffres;

    if (activeFilter !== "all") {
      currentFiltered = currentFiltered.filter((offre) => offre.type === activeFilter);
    }

    const lowercasedSearchTerm = searchTerm.toLowerCase();
    if (lowercasedSearchTerm) {
      currentFiltered = currentFiltered.filter(
        (offre) =>
          offre.titre.toLowerCase().includes(lowercasedSearchTerm) ||
          offre.description.toLowerCase().includes(lowercasedSearchTerm) ||
          offre.recruteurName?.toLowerCase().includes(lowercasedSearchTerm) ||
          offre.type.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    setFilteredOffres(currentFiltered);
    setCurrentPage(1);
  }, [allOffres, activeFilter, searchTerm]);

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

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const modalContentVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
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
      closeModal();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'envoi de la candidature');
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col items-center justify-center">
        <p className="text-lg text-gray-700 mb-4">
          Vous devez être connecté pour voir les offres.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col">
      <Navbar className="sticky top-0 z-10" />
      <motion.div
        className="py-12 md:py-16 container mx-auto px-4 sm:px-6 lg:px-8 flex-grow mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <div className="flex flex-col sm:flex-row justify-center items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, description, ou recruteur..."
              className="w-full pl-10 pr-4 py-2 border border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 text-gray-700 transition-all duration-200 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button
              className={`py-2 px-4 rounded-md text-sm font-semibold ${
                activeFilter === "all"
                  ? "bg-pink-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-pink-100 border border-pink-300"
              } focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-200`}
              onClick={() => setActiveFilter("all")}
            >
              Toutes
            </button>
            <button
              className={`py-2 px-4 rounded-md text-sm font-semibold ${
                activeFilter === "emploi"
                  ? "bg-pink-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-pink-100 border border-pink-300"
              } focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-200`}
              onClick={() => setActiveFilter("emploi")}
            >
              Emploi
            </button>
            <button
              className={`py-2 px-4 rounded-md text-sm font-semibold ${
                activeFilter === "stage"
                  ? "bg-pink-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-pink-100 border border-pink-300"
              } focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-200`}
              onClick={() => setActiveFilter("stage")}
            >
              Stage
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-500 font-semibold">Erreur : {error}</p>
          </div>
        ) : (
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentOffres.length > 0 ? (
                currentOffres.map((offre) => (
                  <motion.div
                    key={offre._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-pink-200 hover:shadow-lg transition duration-200 ease-in-out"
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <div className="p-4 flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-md font-semibold text-gray-800 mb-2 line-clamp-2">
                          {offre.titre}
                        </h3>
                        <p className="text-sm text-gray-500 italic flex items-center mb-1">
                          <FaUser className="mr-2 text-pink-400" />
                          Recruteur :
                          <span className="text-pink-500 font-medium ml-1">
                            {offre.recruteurName}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Type:{" "}
                          <span className="font-semibold">{offre.type}</span>
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <motion.button
                          className="flex items-center text-pink-500 font-semibold text-sm px-3 py-1.5 rounded-full hover:bg-pink-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(offre);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaEye className="mr-2" />
                          <span>Voir</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-600 text-lg">
                    Aucune offre trouvée pour votre recherche.
                  </p>
                </div>
              )}
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeModal}
            >
              <motion.div
                className="relative z-10 w-11/12 md:max-w-md rounded-xl bg-white shadow-lg border border-gray-200 overflow-auto max-h-[90vh]"
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h2 className="text-lg font-semibold text-pink-600">
                    Détails de l'Offre
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-1 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedOffre.titre}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">{selectedOffre.description}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Type:{" "}
                    <span className="font-semibold">{selectedOffre.type}</span>
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <FaUser className="mr-2 text-pink-400" /> Recruteur:
                    <span className="font-medium text-pink-500 ml-1">
                      {selectedOffre.recruteurName}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Publiée le:{" "}
                    {new Date(selectedOffre.datePublication!).toLocaleDateString()}
                  </p>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center space-x-2">
                  <button
                    onClick={closeModal}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-pink-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
                  >
                    Fermer
                  </button>
                  {isEtudiantOrAdmin && (
                    <button
                      onClick={handlePostuler}
                      className="inline-flex items-center rounded-md border border-transparent bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
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