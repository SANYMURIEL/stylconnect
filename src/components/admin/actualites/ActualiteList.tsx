"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import ModalActualiteForm from "@/components/admin/actualites/ModalActualiteForm";

interface Actualite {
  _id: string;
  titre: string;
  description: string;
  media?: string;
  datePublication: string;
}

const ActualiteList = () => {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editActualite, setEditActualite] = useState<Actualite | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmer la suppression de cette actualité ?")) return;
    try {
      const res = await fetch(`/api/admin/actualites/${id}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error("Erreur lors de la suppression de l'actualité");
      fetchActualites();
    } catch (err) {
      alert("Erreur de suppression de l'actualité");
    }
  };

  const openAddModal = () => {
    setEditActualite(null);
    setIsModalOpen(true);
  };

  const openEditModal = (actualite: Actualite) => {
    setEditActualite(actualite);
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
          <span>Ajouter une actualité</span>
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
                Média
              </th>
              <th className="text-left text-sm font-semibold text-pink-500 px-6 py-4">
                Date de Publication
              </th>
              <th className="text-center text-sm font-semibold text-pink-500 px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-6 py-4 text-center" colSpan={5}>
                  Chargement des actualités...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td className="px-6 py-4 text-center text-red-500" colSpan={5}>
                  Erreur: {error}
                </td>
              </tr>
            ) : (
              actualites.map((actualite) => (
                <tr
                  key={actualite._id}
                  className="border-b border-gray-200 hover:bg-pink-50/10 transition text-gray-800"
                >
                  <td className="px-6 py-4 text-sm truncate max-w-xs">
                    {actualite.titre}
                  </td>
                  <td className="px-6 py-4 text-sm truncate max-w-md">
                    {actualite.description}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {actualite.media ? (
                      <img
                        src={actualite.media}
                        alt={actualite.titre}
                        className="h-16 w-24 object-cover rounded-md shadow"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Aucune image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(actualite.datePublication).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        className="text-indigo-500 hover:text-indigo-600"
                        title="Modifier"
                        onClick={() => openEditModal(actualite)}
                      >
                        <Pencil className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        className="text-red-500 hover:text-red-600"
                        title="Supprimer"
                        onClick={() => handleDelete(actualite._id)}
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

      <ModalActualiteForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchActualites}
        editActualite={editActualite}
      />
    </section>
  );
};

export default ActualiteList;
