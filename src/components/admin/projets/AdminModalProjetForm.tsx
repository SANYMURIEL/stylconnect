"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  
  FaLightbulb,
} from "react-icons/fa";
interface Projet {
  _id?: string;
  titre: string;
  description?: string;
  media?: string;
  auteurId?: string;
  likes?: number;
  statut?: "approuve" | "en attente";
}

interface AdminModalProjetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onProjetUpdated: () => void;
  initialProjet: Projet | null;
}

const AdminModalProjetForm = ({
  isOpen,
  onClose,
  onProjetUpdated,
  initialProjet,
}: AdminModalProjetFormProps) => {
  const [form, setForm] = useState({
    titre: "",
    description: "",
    media: "",
    auteurId: "",
    likes: 0,
    statut: "en attente" as "en attente" | "approuve", // Default for new projets created by admin
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialProjet) {
      setForm({
        titre: initialProjet.titre,
        description: initialProjet.description || "",
        media: initialProjet.media || "",
        auteurId: initialProjet.auteurId || "",
        likes: initialProjet.likes || 0,
        statut: initialProjet.statut || "en attente",
      });
    } else {
      setForm({
        titre: "",
        description: "",
        media: "",
        auteurId: "",
        likes: 0,
        statut: "en attente",
      });
    }
  }, [initialProjet]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      titre: form.titre,
      description: form.description,
      media: form.media,
      auteurId: form.auteurId,
      likes: form.likes,
      statut: form.statut,
    };

    const url = initialProjet
      ? `/api/admin/projets/${initialProjet._id}`
      : "/api/admin/projets";
    const method = initialProjet ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onProjetUpdated();
        onClose();
      } else {
        const error = await res.json();
        alert(
          `Erreur lors de l'enregistrement: ${error?.message || res.statusText}`
        );
      }
    } catch (err) {
      alert("Erreur lors de l'enregistrement du projet.");
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-pink-50">
              <h2 className="text-lg font-semibold text-pink-700">
                < FaLightbulb className="w-6 h-6 inline mr-2 -mt-0.5" />
                {initialProjet ? "Modifier le projet" : "Ajouter un projet"}
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="titre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Titre
                </label>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  value={form.titre}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="media"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL Média
                </label>
                <input
                  type="text"
                  id="media"
                  name="media"
                  value={form.media}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="auteurId"
                  className="block text-sm font-medium text-gray-700"
                >
                  ID Auteur
                </label>
                <input
                  type="text"
                  id="auteurId"
                  name="auteurId"
                  value={form.auteurId}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="statut"
                  className="block text-sm font-medium text-gray-700"
                >
                  Statut
                </label>
                <select
                  id="statut"
                  name="statut"
                  value={form.statut}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                >
                  <option value="en attente">En attente</option>
                  <option value="approuve">Approuvée</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center rounded-md border border-transparent bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                {initialProjet ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminModalProjetForm;
