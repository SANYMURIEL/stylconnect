"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

interface ProjetEtudiant {
  _id?: string;
  titre: string;
  description?: string;
  media?: string;
  auteurId: string;
  // dateCreation?: Date; // Géré automatiquement
  // likes?: number;      // Géré potentiellement ailleurs
  // statut?: 'approuve' | 'en attente'; // Géré potentiellement ailleurs
}

interface ModalProjetEtudiantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editProjet: ProjetEtudiant | null;
}

const ModalProjetEtudiantForm = ({
  isOpen,
  onClose,
  onSave,
  editProjet,
}: ModalProjetEtudiantFormProps) => {
  const [form, setForm] = useState({
    titre: "",
    description: "",
    media: "",
    auteurId: "", // Will be filled automatically for the logged-in user
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      setForm((prevForm) => ({ ...prevForm, auteurId: session.user.id }));
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (editProjet) {
      setForm({
        titre: editProjet.titre,
        description: editProjet.description || "",
        media: editProjet.media || "",
        auteurId: editProjet.auteurId,
      });
      setSelectedImage(null);
    } else {
      setForm((prevForm) => ({
        titre: "",
        description: "",
        media: "",
        auteurId: session?.user?.id || "",
      }));
      setSelectedImage(null);
    }
  }, [editProjet, session?.user?.id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return form.media || null;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", "stylconnect_projects"); // Remplacez par votre preset Cloudinary

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dfe7cighj/image/upload", // Remplacez par votre cloud name
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setUploadingImage(false);
      return data.secure_url;
    } catch (error) {
      console.error(
        "Erreur lors de l'upload de l'image vers Cloudinary",
        error
      );
      setUploadingImage(false);
      alert("Erreur lors du téléchargement de l'image.");
      return null;
    }
  };

  const handleSubmit = async () => {
    let imageUrl: string | null = form.media;

    if (selectedImage) {
      imageUrl = await uploadImage();
      if (!imageUrl) return;
    }

    const payload = {
      titre: form.titre,
      description: form.description,
      media: imageUrl,
      auteurId: form.auteurId,
    };

    const url = editProjet
      ? `/api/etudiant/projets/${editProjet._id}`
      : "/api/etudiant/projets";
    const method = editProjet ? "PUT" : "POST";

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
            className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-pink-50">
              <h2 className="text-lg font-semibold text-pink-700">
                <LightBulbIcon className="w-6 h-6 inline mr-2 -mt-0.5" />
                {editProjet ? "Modifier le projet" : "Ajouter un projet"}
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
                  Description (Optionnelle)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="media"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image (Optionnel)
                </label>
                <input
                  type="file"
                  id="media"
                  name="media"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
                {editProjet?.media && !selectedImage && (
                  <p className="mt-1 text-sm text-gray-500">
                    Image actuelle: {editProjet.media}
                  </p>
                )}
                {uploadingImage && (
                  <p className="mt-2 text-sm text-gray-500">
                    Téléchargement de l'image...
                  </p>
                )}
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
                disabled={uploadingImage}
                className={`inline-flex items-center rounded-md border border-transparent bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                  uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadingImage
                  ? "Enregistrement..."
                  : editProjet
                  ? "Enregistrer"
                  : "Ajouter"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalProjetEtudiantForm;
