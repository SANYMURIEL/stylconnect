"use client";

import { useEffect, useState, useMemo } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import ModalOffreForm from "@/components/recruteur/offres/ModalOffreForm";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { FaCheckCircle, FaClock } from "react-icons/fa";

interface Offre {
  _id?: string;
  titre: string;
  description: string;
  type: "stage" | "emploi";
  datePublication?: string;
  statut?: "approuve" | "en attente";
  idRecruteur?: string;
}

const OffreList = () => {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOffre, setEditOffre] = useState<Offre | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "en attente" | "approuve"
  >("all");

  const fetchOffres = async () => {
    try {
      const res = await fetch("/api/recruteur/offres");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setOffres(data);
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffres();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmer la suppression de cette offre ?")) return;
    try {
      const res = await fetch(`/api/recruteur/offres/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression de l'offre");
      fetchOffres();
    } catch (err) {
      alert("Erreur de suppression de l'offre");
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

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ... (cartes du haut inchangées) ... */}
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
          <BriefcaseIcon className="w-8 h-8 text-pink-300" />
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
              Offres approuvées
            </p>
            <p className="text-xl font-semibold text-green-500">
              {offresApprouvees}
            </p>
          </div>
          <FaCheckCircle className="w-8 h-8 text-green-300" />
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 flex flex-col md:flex-row items-center justify-between gap-y-2 md:gap-0">
        <div className="relative flex-grow md:mr-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-sm"
            placeholder="Rechercher un titre ou une description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="ml-0 md:ml-4">
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
            <option value="approuve">Approuvées</option>
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-2 md:mt-0 ml-0 md:ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-md transition duration-150"
          onClick={openAddModal}
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter</span>
        </motion.button>
      </div>

      {/* Offer List Table */}
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white flex-1">
        <table className="min-w-full table-auto">
          <thead className="bg-pink-50 border-b border-pink-100 text-gray-700">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider hidden md:table-cell">
                Description
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider hidden lg:table-cell">
                Publication
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-pink-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-2 py-3 text-center text-xs font-semibold text-pink-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-6 py-4 text-center" colSpan={6}>
                  Chargement des offres...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td className="px-6 py-4 text-center text-red-500" colSpan={6}>
                  Erreur: {error}
                </td>
              </tr>
            ) : (
              filteredOffres.map((offre) => (
                <motion.tr
                  key={offre._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="border-b border-gray-200 hover:bg-pink-50/5 transition-colors text-gray-800"
                >
                  <td className="px-2 py-3 text-sm truncate max-w-[120px]">
                    {offre.titre}
                  </td>
                  <td className="px-2 py-3 text-sm truncate max-w-[200px] hidden md:table-cell">
                    {offre.description}
                  </td>
                  <td className="px-2 py-3 text-sm">{offre.type}</td>
                  <td className="px-2 py-3 text-sm hidden lg:table-cell">
                    {offre.datePublication
                      ? new Date(offre.datePublication).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-2 py-3 text-sm">
                    {offre.statut === "approuve" ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <FaCheckCircle className="w-4 h-4" /> Approuvée
                      </div>
                    ) : offre.statut === "en attente" ? (
                      <div className="flex items-center gap-1 text-orange-500">
                        <FaClock className="w-4 h-4 animate-pulse" /> En attente
                      </div>
                    ) : (
                      offre.statut
                    )}
                  </td>
                  <td className="px-2 py-3 text-center whitespace-nowrap">
                    <div className="flex justify-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="text-indigo-500 hover:text-indigo-600 focus:outline-none p-1"
                        title="Modifier"
                        onClick={() => openEditModal(offre)}
                      >
                        <Pencil className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="text-red-500 hover:text-red-600 focus:outline-none p-1"
                        title="Supprimer"
                        onClick={() => handleDelete(offre._id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalOffreForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchOffres}
        editOffre={editOffre}
      />
    </div>
  );
};

export default OffreList;
