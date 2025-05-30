"use client";

import { useEffect, useState, useMemo } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import ModalProjetEtudiantForm from "@/components/etudiant/projets/ModalProjetEtudiantForm";
import { LightBulbIcon } from "@heroicons/react/24/outline"; // Icône pour les projets
import { FaCheckCircle, FaClock } from "react-icons/fa";
import Image from "next/image"; // Import du composant Image de Next.js

interface ProjetEtudiant {
  _id?: string;
  titre: string;
  description?: string; // Ajout de la description ici
  media?: string;
  dateCreation?: string;
  statut?: "approuve" | "en attente";
  auteurId?: string; // Vous pourriez vouloir afficher des infos de l'auteur
}

const ProjetEtudiantList = () => {
  const [projets, setProjets] = useState<ProjetEtudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProjet, setEditProjet] = useState<ProjetEtudiant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "en attente" | "approuve"
  >("all");

  const fetchProjets = async () => {
    try {
      const res = await fetch("/api/etudiant/projets"); // Assurez-vous que cette route existe
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setProjets(data);
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjets();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmer la suppression de ce projet ?")) return;
    try {
      const res = await fetch(`/api/etudiant/projets/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression du projet");
      fetchProjets();
    } catch (err) {
      alert("Erreur de suppression du projet");
    }
  };

  const openAddModal = () => {
    setEditProjet(null);
    setIsModalOpen(true);
  };

  const openEditModal = (projet: ProjetEtudiant) => {
    setEditProjet(projet);
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    fetchProjets(); // Refresh the list after saving
    setIsModalOpen(false);
  };

  const filteredProjets = useMemo(() => {
    return projets
      .filter((projet) => {
        const searchMatch = projet.titre
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return searchMatch;
      })
      .filter((projet) => {
        return filterStatus === "all" || projet.statut === filterStatus;
      });
  }, [projets, searchQuery, filterStatus]);

  const totalProjets = projets.length;
  const projetsEnAttente = projets.filter(
    (projet) => projet.statut === "en attente"
  ).length;
  const projetsApprouves = projets.filter(
    (projet) => projet.statut === "approuve"
  ).length;

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 15, stiffness: 100 },
    },
  };

  return (
    <section className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          className="bg-white rounded-lg shadow-md border border-gray-100 p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total des projets
            </p>
            <p className="text-xl font-semibold text-pink-500">
              {totalProjets}
            </p>
          </div>
          <LightBulbIcon className="w-8 h-8 text-pink-300" />
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          className="bg-white rounded-lg shadow-md border border-gray-100 p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-gray-500">
              Projets en attente
            </p>
            <p className="text-xl font-semibold text-orange-500">
              {projetsEnAttente}
            </p>
          </div>
          <FaClock className="w-8 h-8 text-orange-300" />
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          className="bg-white rounded-lg shadow-md border border-gray-100 p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-gray-500">
              Projets approuvés
            </p>
            <p className="text-xl font-semibold text-green-500">
              {projetsApprouves}
            </p>
          </div>
          <FaCheckCircle className="w-8 h-8 text-green-300" />
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 flex items-center justify-between">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-sm"
            placeholder="Rechercher un titre de projet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="ml-4">
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value as "all" | "en attente" | "approuve"
              )
            }
            className="py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="en attente">En attente</option>
            <option value="approuve">Approuvés</option>
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-md transition duration-150"
          onClick={openAddModal}
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter</span>
        </motion.button>
      </div>

      {/* Projet List Table */}
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white">
        <table className="min-w-full table-auto">
          <thead className="bg-pink-50 border-b border-pink-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider hidden md:table-cell">
                Date de création
              </th>
              {/* Vous pourriez ajouter une colonne pour l'auteur ici */}
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-pink-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-6 py-4 text-center" colSpan={5}>
                  Chargement des projets...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td className="px-6 py-4 text-center text-red-500" colSpan={5}>
                  Erreur: {error}
                </td>
              </tr>
            ) : (
              filteredProjets.map((projet) => (
                <motion.tr
                  key={projet._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="border-b border-gray-200 hover:bg-pink-50/5 transition-colors text-gray-800"
                >
                  <td className="px-4 py-3">
                    {projet.media ? (
                      <div className="relative w-16 h-10 rounded-md overflow-hidden">
                        <img
                          src={projet.media}
                          alt={projet.titre}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-500">Pas d'image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm truncate max-w-xs">
                    {projet.titre}
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">
                    {projet.dateCreation
                      ? new Date(projet.dateCreation).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {projet.statut === "approuve" ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <FaCheckCircle className="w-4 h-4" /> Approuvé
                      </div>
                    ) : projet.statut === "en attente" ? (
                      <div className="flex items-center gap-1 text-orange-500">
                        <FaClock className="w-4 h-4 animate-pulse" /> En attente
                      </div>
                    ) : (
                      projet.statut
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="text-indigo-500 hover:text-indigo-600 focus:outline-none"
                        title="Modifier"
                        onClick={() => openEditModal(projet)}
                      >
                        <Pencil className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="text-red-500 hover:text-red-600 focus:outline-none"
                        title="Supprimer"
                        onClick={() => handleDelete(projet._id!)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalProjetEtudiantForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal} // Utilisez la nouvelle fonction handleSaveModal
        editProjet={editProjet}
      />
    </section>
  );
};

export default ProjetEtudiantList;
