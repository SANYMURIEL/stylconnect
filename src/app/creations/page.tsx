// app/creations/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineHeart, AiFillHeart, AiOutlinePlus, AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaEye, FaUser, FaSearch } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Projet {
  _id: string;
  titre: string;
  description: string;
  media: string;
  auteurId: {
    _id: string;
    name: string;
  };
  likes: number;
  likesBy: string[];
}

interface ProjetWithAuthorName extends Projet {
  auteurName?: string;
  likedByUser?: boolean;
}

const ITEMS_PER_PAGE = 12;

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-20 text-pink-500">
    <motion.div
      className="text-4xl"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <AiOutlineLoading3Quarters />
    </motion.div>
    <p className="mt-4 text-xl font-semibold">
      Chargement des projets 
    </p>
  </div>
);

const CreationsPage = () => {
  const [allProjets, setAllProjets] = useState<ProjetWithAuthorName[]>([]);
  const [filteredProjets, setFilteredProjets] = useState<ProjetWithAuthorName[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjet, setSelectedProjet] = useState<ProjetWithAuthorName | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCreations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/creations");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: Projet[] = await res.json();
      const projetsWithLikedStatus = data.map(
        (projet: Projet) => {
          const likesBy = projet.likesBy?.map(id => id.toString()) || [];
          return {
            ...projet,
            auteurName: projet.auteurId?.name || "Inconnu",
            likedByUser: userId ? likesBy.includes(userId) : false,
            likes: likesBy.length,
            likesBy: likesBy,
          };
        }
      );
      setAllProjets(projetsWithLikedStatus);
      setFilteredProjets(projetsWithLikedStatus);
    } catch (e: any) {
      console.error("Erreur lors de la récupération des créations:", e);
      setError("Impossible de charger les créations.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCreations();
  }, [fetchCreations]);

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = allProjets.filter(
      (projet) =>
        projet.titre.toLowerCase().includes(lowercasedTerm) ||
        projet.auteurName?.toLowerCase().includes(lowercasedTerm) ||
        projet.description?.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredProjets(filtered);
    setCurrentPage(1);
  }, [searchTerm, allProjets]);

  const handleLike = async (projetId: string) => {
    if (!userId) {
      alert("💖 Vous devez être connecté pour liker !");
      return;
    }

    const projetIndex = allProjets.findIndex((p) => p._id === projetId);
    if (projetIndex === -1) return;

    const originalProjets = [...allProjets];
    const projet = originalProjets[projetIndex];
    const isLiked = projet.likedByUser;
    const method = isLiked ? "DELETE" : "POST";

    const newLikesBy = isLiked
      ? projet.likesBy.filter((id) => id !== userId)
      : [...projet.likesBy, userId];

    const newProjets = allProjets.map(p =>
      p._id === projetId
        ? { ...p, likedByUser: !isLiked, likes: newLikesBy.length, likesBy: newLikesBy }
        : p
    );

    setAllProjets(newProjets);
    setFilteredProjets(prev => prev.map(p =>
      p._id === projetId
        ? { ...p, likedByUser: !isLiked, likes: newLikesBy.length, likesBy: newLikesBy }
        : p
    ));

    if (selectedProjet?._id === projetId) {
      setSelectedProjet(newProjets.find(p => p._id === projetId) || null);
    }

    try {
      const res = await fetch(`/api/creations/${projetId}/like`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        setAllProjets(originalProjets);
        setFilteredProjets(originalProjets.filter(
          (p) =>
            p.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.auteurName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        if (selectedProjet?._id === projetId) {
          setSelectedProjet(projet);
        }
        const errorData = await res.json();
        console.error("Erreur de like:", errorData);
        alert(`Erreur de like: ${errorData.message || "Inconnue"}`);
      }
    } catch (error) {
      setAllProjets(originalProjets);
      setFilteredProjets(originalProjets.filter(
        (p) =>
          p.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.auteurName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      if (selectedProjet?._id === projetId) {
        setSelectedProjet(projet);
      }
      console.error("Erreur de requête de like:", error);
      alert("Impossible de liker pour le moment.");
    }
  };

  const openModal = (projet: ProjetWithAuthorName) => {
    setSelectedProjet(projet);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedProjet(null);
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const likeButtonVariants = {
    initial: { scale: 1 },
    tap: { scale: 1.2, rotate: 15 },
    hover: { scale: 1.1 },
  };

  const viewButtonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, color: "#EC4899" },
    tap: { scale: 0.9 },
  };

  const titleVariants = {
    initial: { opacity: 0, y: -20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const modalVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalContentVariants = {
    initial: { scale: 0.9, y: 50 },
    animate: {
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    exit: { scale: 0.9, y: 50, opacity: 0 },
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjets = filteredProjets.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProjets.length / ITEMS_PER_PAGE);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col font-sans">
      <Navbar />
      <motion.div
        className="py-12 md:py-16 container mx-auto px-4 sm:px-6 lg:px-8 flex-grow mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <section className="mb-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight leading-tight drop-shadow-md"
            variants={titleVariants}
            initial="initial"
            animate="animate"
          >
            Découvrez l'Univers de nos Créations
          </motion.h1>
        </section>

        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-lg">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, auteur ou description"
              className="w-full pl-10 pr-4 py-2 border border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 text-gray-700 transition-all duration-200 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              <AnimatePresence>
                {currentProjets.map((projet) => (
                  <motion.div
                    key={projet._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-pink-200 hover:shadow-lg transition-all duration-300 ease-in-out relative group"
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {projet.media && (
                      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={projet.media}
                          alt={projet.titre}
                          className="object-cover w-full h-full rounded-t-lg transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="p-2 flex flex-col h-full">
                      <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
                        {projet.titre}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center truncate">
                          <FaUser className="mr-1 text-pink-400" />
                          <span className="text-pink-500 font-medium truncate">
                            {projet.auteurName}
                          </span>
                        </span>
                        <div className="flex items-center ml-auto">
                          <motion.button
                            className="flex items-center text-gray-600 hover:text-pink-500 focus:outline-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(projet._id!);
                            }}
                            variants={likeButtonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              {projet.likedByUser ? (
                                <motion.div key="filled" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                  <AiFillHeart className="mr-1 text-pink-500" />
                                </motion.div>
                              ) : (
                                <motion.div key="outline" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                  <AiOutlineHeart className="mr-1" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                          <motion.span
                            key={projet.likes}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {projet.likes || 0}
                          </motion.span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end mt-2">
                        <motion.button
                          className="flex items-center text-gray-600 hover:text-pink-500 focus:outline-none text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(projet);
                          }}
                          variants={viewButtonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <FaEye className="mr-1" />
                          <span className="font-medium">Voir</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
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
          {isModalOpen && selectedProjet && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={closeModal}
            >
              <motion.div
                className="relative w-full max-w-xs sm:max-w-sm rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden max-h-[95vh] flex flex-col"
                variants={modalContentVariants}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                  <h2 className="text-base font-semibold text-pink-600 flex items-center">
                    <AiOutlinePlus className="mr-1 text-pink-500" /> Détail
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3 overflow-y-auto flex-grow">
                  <h2 className="text-lg font-bold text-gray-800">
                    {selectedProjet.titre}
                  </h2>
                  {selectedProjet.media && (
                    <motion.div
                      className="rounded-lg overflow-hidden shadow-md relative aspect-video bg-gray-100"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={selectedProjet.media}
                        alt={selectedProjet.titre}
                        className="w-full h-full object-contain"
                      />
                    </motion.div>
                  )}
                  <p className="text-gray-700 leading-snug text-xs">
                    {selectedProjet.description ||
                      "Pas de description pour cette merveille."}
                  </p>
                  <div className="flex flex-col items-start gap-1 text-xs text-gray-500">
                    <span className="flex items-center">
                      <FaUser className="mr-1 text-pink-400" />
                      Créée par:
                      <span className="font-medium text-pink-500 ml-1">
                        {selectedProjet.auteurName}
                      </span>
                    </span>
                    <motion.button
                      className="flex items-center text-gray-600 hover:text-pink-500 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(selectedProjet._id!);
                      }}
                      variants={likeButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {selectedProjet.likedByUser ? (
                          <motion.div key="filled" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <AiFillHeart className="mr-1 text-pink-500" />
                          </motion.div>
                        ) : (
                          <motion.div key="outline" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <AiOutlineHeart className="mr-1" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <motion.span
                        key={selectedProjet.likes}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {selectedProjet.likes || 0}
                      </motion.span>
                    </motion.button>
                  </div>
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

export default CreationsPage;