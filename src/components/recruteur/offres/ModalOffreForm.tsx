"use client";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Offre {
  _id?: string;
  titre: string;
  description: string;
  type: "stage" | "emploi";
}

interface ModalOffreFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editOffre: Offre | null;
}

const ModalOffreForm = ({
  isOpen,
  onClose,
  onSave,
  editOffre,
}: ModalOffreFormProps) => {
  const [form, setForm] = useState({
    titre: "",
    description: "",
    type: "emploi" as "emploi" | "stage", // Default value
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editOffre) {
      setForm({
        titre: editOffre.titre,
        description: editOffre.description,
        type: editOffre.type,
      });
    } else {
      setForm({
        titre: "",
        description: "",
        type: "emploi",
      });
    }
  }, [editOffre]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, type: e.target.value as "emploi" | "stage" });
  };

  const handleSubmit = async () => {
    const payload = {
      titre: form.titre,
      description: form.description,
      type: form.type,
    };

    const url = editOffre
      ? `/api/recruteur/offres/${editOffre._id}`
      : "/api/recruteur/offres";
    const method = editOffre ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSave();
        onClose();
      } else {
        const error = await res.json();
        alert(
          `Erreur lors de l'enregistrement: ${error?.message || res.statusText}`
        );
      }
    } catch (err) {
      alert("Erreur lors de l'enregistrement de l'offre.");
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl border border-gray-100"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {editOffre ? "Modifier l'offre" : "Ajouter une offre"}
              </h2>
              <button
                onClick={onClose}
                className="hover:bg-gray-100 rounded-md p-1 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
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
                  className="mt-1 block w-full py-2.5 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
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
                  className="mt-1 block w-full py-2.5 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type d'offre
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleTypeChange}
                  className="mt-1 block w-full py-2.5 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                >
                  <option value="emploi">Emploi</option>
                  <option value="stage">Stage</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="inline-flex items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-500 text-sm font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-pink-500 focus:ring-offset-2 transition-colors"
              >
                {editOffre ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalOffreForm;
