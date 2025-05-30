
// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { AiOutlineHeart, AiFillHeart, AiOutlinePlus } from "react-icons/ai";
// import { FaEye, FaUser, FaShoppingCart } from "react-icons/fa";
// import { Projet } from "@/models/Projet";
// import { useSession } from "next-auth/react";
// import { X } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// interface ProjetWithAuthorName extends Projet {
//   auteurName?: string;
//   likedByUser?: boolean;
//   likes?: number;
// }

// const ITEMS_PER_PAGE = 8;

// const CreationsPage = () => {
//   const [allProjets, setAllProjets] = useState<ProjetWithAuthorName[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedProjet, setSelectedProjet] =
//     useState<ProjetWithAuthorName | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { data: session } = useSession();
//   const userId = session?.user?.id;
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchCreations = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch("/api/creations");
//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }
//       const data = await res.json();
//       const projetsWithLikedStatus = data.map(
//         (projet: ProjetWithAuthorName) => ({
//           ...projet,
//           auteurName: projet.auteurId?.name || "Inconnu",
//           likedByUser: userId ? projet.likesBy?.includes(userId) : false,
//         })
//       );
//       setAllProjets(projetsWithLikedStatus);
//     } catch (e: any) {
//       console.error("Erreur lors de la récupération des créations:", e);
//       setError("Impossible de charger les créations.");
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   useEffect(() => {
//     fetchCreations();
//   }, [fetchCreations]);

//   const handleLike = async (projetId: string) => {
//     // ... (fonction handleLike inchangée)
//     if (!userId) {
//       alert("💖 Vous devez être connecté pour liker !");
//       return;
//     }
//     const isLiked = allProjets.find((p) => p._id === projetId)?.likedByUser;
//     try {
//       const res = await fetch(`/api/creations/${projetId}/like`, {
//         method: isLiked ? "DELETE" : "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       });
//       if (res.ok) {
//         setAllProjets((prevProjets) =>
//           prevProjets.map((p) => {
//             if (p._id === projetId) {
//               const newLikedByUser = !isLiked;
//               const newLikesCount = newLikedByUser
//                 ? (p.likes || 0) + 1
//                 : (p.likes || 1) - 1;

//               return {
//                 ...p,
//                 likesBy: newLikedByUser
//                   ? [...(p.likesBy || []), userId]
//                   : p.likesBy?.filter((id) => id !== userId),
//                 likedByUser: newLikedByUser,
//                 likes: newLikesCount >= 0 ? newLikesCount : 0,
//               };
//             }
//             return p;
//           })
//         );
//       } else {
//         const errorData = await res.json();
//         console.error("Erreur de like:", errorData);
//         alert(`Erreur de like: ${errorData.message || "Inconnue"}`);
//       }
//     } catch (error) {
//       console.error("Erreur de requête de like:", error);
//       alert("Impossible de liker pour le moment.");
//     }
//   };

//   const openModal = (projet: ProjetWithAuthorName) => {
//     setSelectedProjet(projet);
//     setIsModalOpen(true);
//     document.body.style.overflow = "hidden";
//   };

//   const closeModal = () => {
//     setSelectedProjet(null);
//     setIsModalOpen(false);
//     document.body.style.overflow = "auto";
//   };

//   const handleCommander = () => {
//     // ... (fonction handleCommander inchangée)
//     if (selectedProjet) {
//       alert(`Commander : ${selectedProjet.titre}`);
//       console.log("Commander le projet :", selectedProjet);
//       // Logique de commande ici
//     }
//   };

//   const cardVariants = {
//     initial: { opacity: 0, scale: 0.95 },
//     animate: { opacity: 1, scale: 1 },
//     hover: { scale: 1.02, transition: { duration: 0.2 } },
//   };

//   const titleVariants = {
//     initial: { opacity: 0, y: -10 },
//     animate: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.5, ease: "easeOut" },
//     },
//   };

//   const modalVariants = {
//     initial: { opacity: 0 },
//     animate: { opacity: 1 },
//     exit: { opacity: 0 },
//   };

//   const modalContentVariants = {
//     initial: { scale: 0.95, opacity: 0 },
//     animate: {
//       scale: 1,
//       opacity: 1,
//       transition: { type: "spring", stiffness: 100, damping: 20 },
//     },
//     exit: { scale: 0.95, opacity: 0 },
//   };

//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const currentProjets = allProjets.slice(startIndex, endIndex);
//   const totalPages = Math.ceil(allProjets.length / ITEMS_PER_PAGE);

//   const goToPreviousPage = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   const goToNextPage = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       <Navbar className="sticky top-0 z-10" />
//       <motion.div
//         className="py-12 md:py-16 container mx-auto px-4 sm:px-6 lg:px-8 flex-grow mt-16"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.7, ease: "easeInOut" }}
//       >
       

//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <p className="text-xl text-pink-500 font-semibold animate-pulse">
//               Chargement des projets... ✨
//             </p>
//           </div>
//         ) : error ? (
//           <div className="flex justify-center items-center py-20">
//             <p className="text-red-500 font-semibold">Erreur : {error}</p>
//           </div>
//         ) : (
//           <section className="mb-12">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {currentProjets.map((projet) => (
//                 <motion.div
//                   key={projet._id}
//                   className="bg-white rounded-lg shadow-md overflow-hidden border border-pink-200 hover:shadow-lg transition duration-200 ease-in-out"
//                   variants={cardVariants}
//                   initial="initial"
//                   animate="animate"
//                   whileHover="hover"
//                   onClick={() => openModal(projet)}
//                 >
//                   {projet.media && (
//                     <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
//                       <img
//                         src={projet.media}
//                         alt={projet.titre}
//                         className="object-cover w-full h-full rounded-t-lg"
//                       />
//                     </div>
//                   )}
//                   <div className="p-4 flex flex-col justify-between h-full">
//                     <div>
//                       <h3 className="text-md font-semibold text-gray-800 mb-2 line-clamp-2">
//                         {projet.titre}
//                       </h3>
//                       <p className="text-sm text-gray-500 italic flex items-center mb-1">
//                         <FaUser className="mr-2 text-pink-400" />
//                         <span className="text-pink-500 font-medium">
//                           {projet.auteurName}
//                         </span>
//                       </p>
//                       <div className="flex items-center text-sm text-gray-500 mb-2">
//                         <AiFillHeart className="text-pink-500 mr-1" />
//                         <span>
//                           {projet.likes || projet.likesBy?.length || 0} like
//                           {(projet.likes || projet.likesBy?.length || 0) > 1
//                             ? "s"
//                             : ""}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between mt-2">
//                       <button
//                         className="flex items-center text-gray-600 hover:text-pink-500 focus:outline-none text-sm"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleLike(projet._id!);
//                         }}
//                       >
//                         {projet.likedByUser ? (
//                           <AiFillHeart className="mr-1 text-pink-500" />
//                         ) : (
//                           <AiOutlineHeart className="mr-1" />
//                         )}
//                       </button>
//                       <button
//                         className="flex items-center text-gray-600 hover:text-blue-500 focus:outline-none text-sm"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openModal(projet);
//                         }}
//                       >
//                         <FaEye className="mr-1 text-blue-400" />
//                         <span className="text-gray-700">Voir</span>
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {totalPages > 1 && (
//               <div className="mt-8 py-4 bg-white rounded-md shadow-sm flex justify-center space-x-2">
//                 <button
//                   onClick={goToPreviousPage}
//                   disabled={currentPage === 1}
//                   className={`py-2 px-4 rounded-md text-sm ${
//                     currentPage === 1
//                       ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                       : "bg-pink-100 text-gray-700 hover:bg-pink-200 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                   }`}
//                 >
//                   Précédent
//                 </button>
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                   (page) => (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`py-2 px-4 rounded-md text-sm font-medium ${
//                         currentPage === page
//                           ? "bg-pink-500 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
//                           : "bg-white text-gray-700 hover:bg-pink-100 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   )
//                 )}
//                 <button
//                   onClick={goToNextPage}
//                   disabled={currentPage === totalPages}
//                   className={`py-2 px-4 rounded-md text-sm ${
//                     currentPage === totalPages
//                       ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                       : "bg-pink-100 text-gray-700 hover:bg-pink-200 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                   }`}
//                 >
//                   Suivant
//                 </button>
//               </div>
//             )}
//           </section>
//         )}

//         <AnimatePresence>
//           {isModalOpen && selectedProjet && (
//             <motion.div
//               className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
//               variants={modalVariants}
//               initial="initial"
//               animate="animate"
//               exit="exit"
//               onClick={closeModal}
//             >
//               <motion.div
//                 className="relative z-10 w-11/12 md:max-w-lg rounded-xl bg-white shadow-lg border border-gray-200 overflow-auto max-h-[90vh]"
//                 variants={modalContentVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//                   <h2 className="text-lg font-semibold text-pink-600 flex items-center">
//                     <AiOutlinePlus className="mr-2 text-pink-500" /> Détail de
//                     l'Œuvre
//                   </h2>
//                   <button
//                     onClick={closeModal}
//                     className="p-1 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>

//                 <div className="p-6 space-y-4">
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     {selectedProjet.titre}
//                   </h2>
//                   {selectedProjet.media && (
//                     <div
//                       className="rounded-md overflow-hidden shadow-md relative aspect-video bg-gray-100"
//                       style={{ maxHeight: "60vh" }}
//                     >
//                       <img
//                         src={selectedProjet.media}
//                         alt={selectedProjet.titre}
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                   )}
//                   <p className="text-gray-700">
//                     {selectedProjet.description ||
//                       "Pas de description pour cette merveille."}
//                   </p>
//                   <p className="text-sm text-gray-500 flex items-center">
//                     <FaUser className="mr-2 text-pink-400" /> Créée par:
//                     <span className="font-medium text-pink-500">
//                       {selectedProjet.auteurName}
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Le:{" "}
//                     {new Date(
//                       selectedProjet.dateCreation!
//                     ).toLocaleDateString()}
//                   </p>
//                 </div>

//                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
//                   <button
//                     onClick={closeModal}
//                     className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-pink-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
//                   >
//                     Fermer
//                   </button>
//                   <button
//                     onClick={handleCommander}
//                     className="inline-flex items-center rounded-md border borderpink-300 bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
//                   >
//                     <FaShoppingCart className="mr-2" /> Commander
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//       <Footer />
//     </div>
//   );
// };

// export default CreationsPage;
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineHeart, AiFillHeart, AiOutlinePlus } from "react-icons/ai";
import { FaEye, FaUser, FaShoppingCart } from "react-icons/fa";
import { Projet } from "@/models/Projet";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ProjetWithAuthorName extends Projet {
  auteurName?: string;
  likedByUser?: boolean;
  likes?: number;
}

const ITEMS_PER_PAGE = 8;

const CreationsPage = () => {
  const [allProjets, setAllProjets] = useState<ProjetWithAuthorName[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjet, setSelectedProjet] =
    useState<ProjetWithAuthorName | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/creations");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const projetsWithLikedStatus = data.map(
        (projet: ProjetWithAuthorName) => ({
          ...projet,
          auteurName: projet.auteurId?.name || "Inconnu",
          likedByUser: userId ? projet.likesBy?.includes(userId) : false,
        })
      );
      setAllProjets(projetsWithLikedStatus);
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

  const handleLike = async (projetId: string) => {
    if (!userId) {
      alert("💖 Vous devez être connecté pour liker !");
      return;
    }
    const isLiked = allProjets.find((p) => p._id === projetId)?.likedByUser;
    try {
      const res = await fetch(`/api/creations/${projetId}/like`, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setAllProjets((prevProjets) =>
          prevProjets.map((p) => {
            if (p._id === projetId) {
              const newLikedByUser = !isLiked;
              const newLikesCount = newLikedByUser
                ? (p.likes || 0) + 1
                : (p.likes || 1) - 1;

              return {
                ...p,
                likesBy: newLikedByUser
                  ? [...(p.likesBy || []), userId]
                  : p.likesBy?.filter((id) => id !== userId),
                likedByUser: newLikedByUser,
                likes: newLikesCount >= 0 ? newLikesCount : 0,
              };
            }
            return p;
          })
        );
      } else {
        const errorData = await res.json();
        console.error("Erreur de like:", errorData);
        alert(`Erreur de like: ${errorData.message || "Inconnue"}`);
      }
    } catch (error) {
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

  const handleCommander = () => {
    if (selectedProjet) {
      alert(`Commander : ${selectedProjet.titre}`);
      console.log("Commander le projet :", selectedProjet);
      // Logique de commande ici
    }
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
  const currentProjets = allProjets.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allProjets.length / ITEMS_PER_PAGE);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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
            Découvrez les Créations
          </motion.h1>
          <p className="text-lg text-gray-600">
            Explorez le monde de nos créateurs.
          </p>
        </section>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-xl text-pink-500 font-semibold animate-pulse">
              Chargement des projets... ✨
            </p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-500 font-semibold">Erreur : {error}</p>
          </div>
        ) : (
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProjets.map((projet) => (
                <motion.div
                  key={projet._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-pink-200 hover:shadow-lg transition duration-200 ease-in-out"
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  onClick={() => openModal(projet)}
                >
                  {projet.media && (
                    <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={projet.media}
                        alt={projet.titre}
                        className="object-cover w-full h-full rounded-t-lg"
                      />
                    </div>
                  )}
                  <div className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-md font-semibold text-gray-800 mb-2 line-clamp-2">
                        {projet.titre}
                      </h3>
                      <p className="text-sm text-gray-500 italic flex items-center mb-1">
                        <FaUser className="mr-2 text-pink-400" />
                        <span className="text-pink-500 font-medium">
                          {projet.auteurName}
                        </span>
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <AiFillHeart className="text-pink-500 mr-1" />
                        <span>
                          {projet.likes || projet.likesBy?.length || 0} like
                          {(projet.likes || projet.likesBy?.length || 0) > 1
                            ? "s"
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        className="flex items-center text-gray-600 hover:text-pink-500 focus:outline-none text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(projet._id!);
                        }}
                      >
                        {projet.likedByUser ? (
                          <AiFillHeart className="mr-1 text-pink-500" />
                        ) : (
                          <AiOutlineHeart className="mr-1" />
                        )}
                      </button>
                      <button
                        className="flex items-center text-gray-600 hover:text-blue-500 focus:outline-none text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(projet);
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
          {isModalOpen && selectedProjet && (
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
                    l'Œuvre
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
                    {selectedProjet.titre}
                  </h2>
                  {selectedProjet.media && (
                    <div
                      className="rounded-md overflow-hidden shadow-md relative aspect-video bg-gray-100"
                      style={{ maxHeight: "60vh" }}
                    >
                      <img
                        src={selectedProjet.media}
                        alt={selectedProjet.titre}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <p className="text-gray-700">
                    {selectedProjet.description ||
                      "Pas de description pour cette merveille."}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <FaUser className="mr-2 text-pink-400" /> Créée par:
                    <span className="font-medium text-pink-500">
                      {selectedProjet.auteurName}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Le:{" "}
                    {new Date(
                      selectedProjet.dateCreation!
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={closeModal}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-pink-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    Fermer
                  </button>
                  {session?.user && (
                    <button
                      onClick={handleCommander}
                      className="inline-flex items-center rounded-md border border-pink-300 bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      <FaShoppingCart className="mr-2" /> Commander
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

export default CreationsPage;