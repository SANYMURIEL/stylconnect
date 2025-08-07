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
    setLoading(true); // Déplacé ici pour réinitialiser l'état de chargement à chaque appel
    setError(null); // Réinitialiser l'erreur
    try {
      const res = await fetch("/api/admin/actualites");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Erreur HTTP: ${res.status} - ${
            errorData.message || "Erreur inconnue"
          }`
        );
      }
      const data = await res.json();
      setActualites(data);
      setLoading(false);
    } catch (e: any) {
      console.error("Erreur lors de la récupération des actualités:", e);
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
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Erreur lors de la suppression: ${
            errorData.message || res.statusText
          }`
        );
      }
      fetchActualites();
    } catch (err: any) {
      alert(`Erreur de suppression de l'actualité: ${err.message}`);
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

      {/* --- RETRAIT DU rounded-xl ici --- */}
      <div className="overflow-x-auto shadow-md border border-gray-200 bg-white">
        {/* --- max-h ajusté pour 3 éléments bien visibles (environ 340px) --- */}
        <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
          <table className="min-w-full table-auto">
            {/* --- Centrage des en-têtes et ajout de sticky --- */}
            <thead className="bg-pink-50 border-b border-pink-100 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold text-pink-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-pink-500 uppercase tracking-wider hidden md:table-cell">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-pink-500 uppercase tracking-wider hidden lg:table-cell">
                  Média
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-pink-500 uppercase tracking-wider">
                  Publication
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-pink-500 uppercase tracking-wider">
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
              ) : actualites.length === 0 ? (
                <tr>
                  <td className="px-6 py-4 text-center text-gray-500" colSpan={5}>
                    Aucune actualité trouvée.
                  </td>
                </tr>
              ) : (
                actualites.map((actualite) => (
                  <tr
                    key={actualite._id}
                    className="border-b border-gray-200 hover:bg-pink-50/10 transition text-gray-800"
                  >
                    <td className="px-4 py-3 text-sm truncate max-w-[200px] text-center">
                      {actualite.titre}
                    </td>
                    <td className="px-4 py-3 text-sm truncate max-w-[300px] hidden md:table-cell text-center">
                      {actualite.description}
                    </td>
                    <td className="px-4 py-3 text-sm hidden lg:table-cell text-center">
                      {actualite.media ? (
                        <div className="h-16 w-24 overflow-hidden rounded-md shadow mx-auto"> {/* Ajout de mx-auto pour centrer */}
                          <img
                            src={actualite.media}
                            alt={actualite.titre}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Aucune image</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-center">
                      {new Date(actualite.datePublication).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="text-indigo-500 hover:text-indigo-600 focus:outline-none p-1"
                          title="Modifier"
                          onClick={() => openEditModal(actualite)}
                        >
                          <Pencil className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="text-red-500 hover:text-red-600 focus:outline-none p-1"
                          title="Supprimer"
                          onClick={() => handleDelete(actualite._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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