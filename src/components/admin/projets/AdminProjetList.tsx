"use client";

import { useEffect, useState, useMemo } from "react";
import { Trash2, Plus, Search, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminModalProjetForm from "./AdminModalProjetForm";
import AdminProjetDetailsModal from "./AdminProjetDetailsModal";

import {
  FaCheckCircle as FaCheckCircleSolid,
  FaClock,
  FaLightbulb,
} from "react-icons/fa";
import { CheckCircle } from "lucide-react";

interface Projet {
    _id?: string;
    titre: string;
    description?: string;
    dateCreation?: string;
    media?: string;
    auteurId?: any;
    auteur?: {
        _id: string;
        nom: string;
        email: string;
    };
    likes?: number;
    statut?: "approuve" | "en attente";
}

const AdminProjetList = () => {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProjet, setEditProjet] = useState<Projet | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "en attente" | "approuve"
  >("all");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedProjetDetails, setSelectedProjetDetails] =
    useState<Projet | null>(null);

  const fetchProjets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/projets");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Erreur HTTP: ${res.status} - ${
            errorData.message || "Erreur inconnue"
          }`
        );
      }
      const data = await res.json();
      setProjets(data);
      setLoading(false);
    } catch (e: any) {
      console.error("Erreur lors de la récupération des projets (Admin):", e);
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjets();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm("Confirmer l'approbation de ce projet ?")) return;
    try {
      const res = await fetch(`/api/admin/projets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: "approuve" }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Erreur lors de l'approbation: ${errorData.message || res.statusText}`
        );
      }
      fetchProjets();
    } catch (err: any) {
      alert(`Erreur lors de l'approbation du projet: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmer la suppression de ce projet ?")) return;
    try {
      const res = await fetch(`/api/admin/projets/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Erreur lors de la suppression: ${
            errorData.message || res.statusText
          }`
        );
      }
      fetchProjets();
    } catch (err: any) {
      alert(`Erreur de suppression du projet: ${err.message}`);
    }
  };

  const openAddModal = () => {
    setEditProjet(null);
    setIsModalOpen(true);
  };

  const openEditModal = (projet: Projet) => {
    setEditProjet(projet);
    setIsModalOpen(true);
  };

  const openDetailsModal = (projet: Projet) => {
    setSelectedProjetDetails(projet);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedProjetDetails(null);
  };

  const filteredProjets = useMemo(() => {
    return projets.filter((projet) => {
      const searchMatch =
        projet.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (projet.description &&
          projet.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const statusMatch =
        filterStatus === "all" || projet.statut === filterStatus;
      return searchMatch && statusMatch;
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

  const rowVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.15, ease: "easeIn" } },
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <FaLightbulb className="mr-3 w-8 h-8 animate-spin text-pink-500" />
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
          <FaClock className="w-8 h-8 text-orange-300 animate-spin slow-spin" />
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
          <FaCheckCircleSolid className="w-8 h-8 text-green-300 animate-pulse" />
        </motion.div>
      </div>

      {/* Search, Filter and Add Button */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-y-3 sm:gap-x-4 mb-4">
        <div className="relative flex-grow w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-sm text-gray-800 bg-transparent"
            placeholder="Rechercher par titre ou description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto flex items-center gap-x-2 sm:gap-x-4">
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value as "all" | "en attente" | "approuve"
              )
            }
            className="py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-sm text-gray-800 bg-transparent"
          >
            <option value="all">Tous</option>
            <option value="en attente">En attente</option>
            <option value="approuve">Approuvés</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-md transition duration-150 flex-shrink-0"
            onClick={openAddModal}
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Ajouter</span>
          </motion.button>
        </div>
      </div>

      {/* Projet List Table */}
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white flex-1">
        <table className="min-w-full table-auto">
          <thead className="bg-pink-50 border-b border-pink-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider hidden sm:table-cell">
                Création
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider hidden md:table-cell">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider hidden lg:table-cell">
                Auteur
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-pink-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td
                    className="px-6 py-4 text-center text-gray-500"
                    colSpan={5}
                  >
                    Chargement...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    className="px-6 py-4 text-center text-red-500"
                    colSpan={5}
                  >
                    Erreur: {error}
                  </td>
                </tr>
              ) : filteredProjets.length === 0 ? (
                <tr>
                  <td
                    className="px-6 py-4 text-center text-gray-500"
                    colSpan={5}
                  >
                    Aucun projet trouvé.
                  </td>
                </tr>
              ) : (
                filteredProjets.map((projet) => (
                  <motion.tr
                    key={projet._id}
                    variants={rowVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="border-b border-gray-200 hover:bg-pink-50/5 transition-colors text-gray-800"
                  >
                    <td className="px-4 py-3 text-sm font-medium">
                      {projet.titre}
                    </td>
                    <td className="px-4 py-3 text-sm hidden sm:table-cell">
                      {projet.dateCreation
                        ? new Date(projet.dateCreation).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">
                      {projet.statut === "approuve" ? (
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <FaCheckCircleSolid className="w-4 h-4 animate-pulse" />{" "}
                          Approuvé
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-orange-500 font-semibold">
                          <FaClock className="w-4 h-4 animate-spin slow-spin" />{" "}
                          En attente
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm hidden lg:table-cell">
                      {projet.auteur?.nom ||
                        (typeof projet.auteurId === "object" &&
                        projet.auteurId !== null &&
                        "name" in projet.auteurId
                          ? projet.auteurId.name
                          : String(projet.auteurId || "N/A"))}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="text-blue-500 hover:text-blue-600 focus:outline-none p-1 rounded-md transition-colors"
                          title="Voir les détails"
                          onClick={() => openDetailsModal(projet)}
                        >
                          <Eye className="w-5 h-5" />
                        </motion.button>
                        {projet.statut === "en attente" && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="text-green-500 hover:text-green-600 focus:outline-none p-1 rounded-md transition-colors"
                            title="Approuver"
                            onClick={() => handleApprove(projet._id!)}
                          >
                            <CheckCircle className="w-5 h-5 animate-pulse" />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="text-red-500 hover:text-red-600 focus:outline-none p-1 rounded-md transition-colors"
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
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <AdminModalProjetForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialProjet={editProjet}
            onProjetUpdated={fetchProjets}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailsModalOpen && selectedProjetDetails && (
          <AdminProjetDetailsModal
            isOpen={detailsModalOpen}
            onClose={closeDetailsModal}
            projet={selectedProjetDetails}
            onEdit={() => {
              closeDetailsModal();
              openEditModal(selectedProjetDetails);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProjetList;