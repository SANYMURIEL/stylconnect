"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import ModalOffreForm from "@/components/recruteur/offres/ModalOffreForm"; 

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

  return (
    <section className="space-y-6">
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition duration-200"
          onClick={openAddModal}
        >
          <motion.span
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-white"
          >
            <Plus className="w-5 h-5" />
          </motion.span>
          <span>Ajouter une offre</span>
        </motion.button>
      </div>

      <div className="overflow-auto rounded-xl shadow-md border border-gray-200 bg-white">
        <table className="min-w-full table-auto">
          <thead className="bg-pink-50 border-b border-pink-100 text-gray-700">
            <tr>
              <th className="text-left text-sm font-semibold text-pink-500 px-6 py-4">
                Titre
              </th>
              <th className="text-left text-sm font-semibold text-pink-500 px-6 py-4">
                Description
              </th>
              <th className="text-left text-sm font-semibold text-pink-500 px-6 py-4">
                Type
              </th>
              <th className="text-left text-sm font-semibold text-pink-500 px-6 py-4">
                Date de Publication
              </th>
              <th className="text-left text-sm font-semibold text-pink-500 px-6 py-4">
                Statut
              </th>
              <th className="text-center text-sm font-semibold text-pink-500 px-6 py-4">
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
              offres.map((offre) => (
                <tr
                  key={offre._id}
                  className="border-b border-gray-200 hover:bg-pink-50/10 transition text-gray-800"
                >
                  <td className="px-6 py-4 text-sm truncate max-w-xs">
                    {offre.titre}
                  </td>
                  <td className="px-6 py-4 text-sm truncate max-w-md">
                    {offre.description}
                  </td>
                  <td className="px-6 py-4 text-sm">{offre.type}</td>
                  <td className="px-6 py-4 text-sm">
                    {offre.datePublication
                      ? new Date(offre.datePublication).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">{offre.statut}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        className="text-indigo-500 hover:text-indigo-600"
                        title="Modifier"
                        onClick={() => openEditModal(offre)}
                      >
                        <Pencil className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        className="text-red-500 hover:text-red-600"
                        title="Supprimer"
                        onClick={() => handleDelete(offre._id!)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
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
    </section>
  );
};

export default OffreList;
