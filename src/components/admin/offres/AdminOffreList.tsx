"use client";

import { useEffect, useState, useMemo } from "react";
import { Trash2, Plus, Search, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminModalOffreForm from "./AdminModalOffreForm";
import AdminOffreDetailsModal from "./AdminOffreDetailsModal";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { FaCheckCircle as FaCheckCircleSolid, FaClock } from "react-icons/fa";
import { CheckCircle } from "lucide-react";

interface Offre {
    _id?: string;
    titre: string;
    description: string;
    type: "stage" | "emploi";
    datePublication?: string;
    statut?: "approuve" | "en attente";
    idRecruteur?: any;
    recruteur?: {
        _id: string;
        nom: string;
        email: string;
    };
}

const AdminOffreList = () => {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOffre, setEditOffre] = useState<Offre | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "en attente" | "approuve"
  >("all");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOffreDetails, setSelectedOffreDetails] =
    useState<Offre | null>(null);

  const fetchOffres = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/offres");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Erreur HTTP: ${res.status} - ${
            errorData.message || "Erreur inconnue"
          }`
        );
      }
      const data = await res.json();
      setOffres(data);
      setLoading(false);
    } catch (e: any) {
      console.error("Erreur lors de la récupération des offres (Admin):", e);
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffres();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm("Confirmer l'approbation de cette offre ?")) return;
    try {
      const res = await fetch(`/api/admin/offres/${id}`, {
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
      fetchOffres();
    } catch (err: any) {
      alert(`Erreur lors de l'approbation de l'offre: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmer la suppression de cette offre ?")) return;
    try {
      const res = await fetch(`/api/admin/offres/${id}`, {
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
      fetchOffres();
    } catch (err: any) {
      alert(`Erreur de suppression de l'offre: ${err.message}`);
    }
  };

  const openAddModal = () => {
    setEditOffre(null);
    setIsModalOpen(true);
  };

  const openEditModal = (offre: Offre) => {
    setEditOffre(offre);
    setIsModalOpen(true);
  };

  const openDetailsModal = (offre: Offre) => {
    setSelectedOffreDetails(offre);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedOffreDetails(null);
  };

  const filteredOffres = useMemo(() => {
    return offres.filter((offre) => {
      const searchMatch =
        offre.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offre.description.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch =
        filterStatus === "all" || offre.statut === filterStatus;
      return searchMatch && statusMatch;
    });
  }, [offres, searchQuery, filterStatus]);

  const totalOffres = offres.length;
  const offresEnAttente = offres.filter(
    (offre) => offre.statut === "en attente"
  ).length;
  const offresApprouvees = offres.filter(
    (offre) => offre.statut === "approuve"
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
              Total des offres
            </p>
            <p className="text-xl font-semibold text-pink-500">{totalOffres}</p>
          </div>
          <BriefcaseIcon className="w-8 h-8 text-pink-300 animate-pulse" />
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          className="bg-white rounded-lg shadow-md border border-gray-100 p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-gray-500">
              Offres en attente
            </p>
            <p className="text-xl font-semibold text-orange-500">
              {offresEnAttente}
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
              Offres approuvées
            </p>
            <p className="text-xl font-semibold text-green-500">
              {offresApprouvees}
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
            placeholder="Rechercher par titre..."
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
            <option value="approuve">Approuvées</option>
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

      {/* Offer List Table */}
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white flex-1">
        <table className="min-w-full table-auto">
          <thead className="bg-pink-50 border-b border-pink-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider hidden sm:table-cell">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider hidden md:table-cell">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider hidden lg:table-cell">
                Recruteur
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
              ) : filteredOffres.length === 0 ? (
                <tr>
                  <td
                    className="px-6 py-4 text-center text-gray-500"
                    colSpan={5}
                  >
                    Aucune offre trouvée.
                  </td>
                </tr>
              ) : (
                filteredOffres.map((offre) => (
                  <motion.tr
                    key={offre._id}
                    variants={rowVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="border-b border-gray-200 hover:bg-pink-50/5 transition-colors text-gray-800"
                  >
                    <td className="px-4 py-3 text-sm font-medium">
                      {offre.titre}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize hidden sm:table-cell">
                      {offre.type}
                    </td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">
                      {offre.statut === "approuve" ? (
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <FaCheckCircleSolid className="w-4 h-4 animate-pulse" />{" "}
                          Approuvée
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-orange-500 font-semibold">
                          <FaClock className="w-4 h-4 animate-spin slow-spin" />{" "}
                          En attente
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm hidden lg:table-cell">
                      {offre.recruteur?.nom ||
                        (typeof offre.idRecruteur === "object" &&
                        offre.idRecruteur !== null &&
                        "name" in offre.idRecruteur
                          ? offre.idRecruteur.name
                          : String(offre.idRecruteur || "N/A"))}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="text-blue-500 hover:text-blue-600 focus:outline-none p-1 rounded-md transition-colors"
                          title="Voir les détails"
                          onClick={() => openDetailsModal(offre)}
                        >
                          <Eye className="w-5 h-5" />
                        </motion.button>
                        {offre.statut === "en attente" && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="text-green-500 hover:text-green-600 focus:outline-none p-1 rounded-md transition-colors"
                            title="Approuver"
                            onClick={() => handleApprove(offre._id!)}
                          >
                            <CheckCircle className="w-5 h-5 animate-pulse" />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="text-red-500 hover:text-red-600 focus:outline-none p-1 rounded-md transition-colors"
                          title="Supprimer"
                          onClick={() => handleDelete(offre._id!)}
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
          <AdminModalOffreForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialOffre={editOffre}
            onOffreUpdated={fetchOffres}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailsModalOpen && selectedOffreDetails && (
          <AdminOffreDetailsModal
            isOpen={detailsModalOpen}
            onClose={closeDetailsModal}
            offre={selectedOffreDetails}
            onEdit={() => {
              closeDetailsModal();
              openEditModal(selectedOffreDetails);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOffreList;