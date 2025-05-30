"use client";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Actualite {
  _id?: string;
  titre: string;
  description: string;
  media?: string;
}

interface ModalActualiteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editActualite: Actualite | null;
}

const ModalActualiteForm = ({
  isOpen,
  onClose,
  onSave,
  editActualite,
}: ModalActualiteFormProps) => {
  const [form, setForm] = useState({
    titre: "",
    description: "",
    media: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editActualite) {
      setForm({
        titre: editActualite.titre,
        description: editActualite.description,
        media: editActualite.media || "",
      });
      setSelectedImage(null);
    } else {
      setForm({
        titre: "",
        description: "",
        media: "",
      });
      setSelectedImage(null);
    }
  }, [editActualite]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", "my-actualites-upload"); // Utilisation du cloud preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dfe7cighj/image/upload", // Utilisation du cloud name
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log("Réponse de Cloudinary:", data); // Ajout du log pour le débogage
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
    };

    const url = editActualite
      ? `/api/admin/actualites/${editActualite._id}`
      : "/api/admin/actualites";
    const method = editActualite ? "PUT" : "POST";

    console.log("Requête vers l'API:", { url, method, payload }); // Ajout du log pour le débogage

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log("Enregistrement réussi"); // Ajout du log
        onSave();
        onClose();
      } else {
        const error = await res.json();
        console.error("Erreur lors de l'enregistrement:", error); // Ajout du log d'erreur
        alert(
          `Erreur lors de l'enregistrement: ${error?.message || res.statusText}`
        );
      }
    } catch (err) {
      console.error("Erreur lors de la requête d'enregistrement:", err); // Ajout du log d'erreur
      alert("Erreur lors de l'enregistrement de l'actualité.");
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
                {editActualite
                  ? "Modifier l'actualité"
                  : "Ajouter une actualité"}
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
                  htmlFor="media"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image (Optionnel)
                </label>
                <input
                  type="file"
                  id="media"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
                {editActualite?.media && !selectedImage && (
                  <p className="mt-1 text-sm text-gray-500">
                    Image actuelle: {editActualite.media}
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
            <div className="px-6 py-5 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="inline-flex items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploadingImage}
                className={`inline-flex items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-500 text-sm font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-pink-500 focus:ring-offset-2 transition-colors ${
                  uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadingImage
                  ? "Enregistrement..."
                  : editActualite
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

export default ModalActualiteForm;
