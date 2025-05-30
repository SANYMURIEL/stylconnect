"use client";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserAvatar from "../../public/images/default.png";
import Image from "next/image";

interface ModalUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editUser: any;
}

const ModalUserForm = ({
  isOpen,
  onClose,
  onSave,
  editUser,
}: ModalUserFormProps) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "recruteur",
    password: "",
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editUser) {
      setForm({
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
        password: "", 
      });
    } else {
      setForm({
        name: "",
        email: "",
        role: "recruteur",
        password: "",
      });
    }
  }, [editUser]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = editUser
      ? `/api/admin/users/${editUser._id}`
      : "/api/admin/users";
    const method = editUser ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de l'enregistrement:", errorData);
        alert(`Erreur lors de l'enregistrement: ${response.statusText}`);
        return;
      }

      onSave();
      onClose();
    } catch (err) {
      console.error("Erreur inattendue lors de l'enregistrement:", err);
      alert("Erreur inattendue lors de l'enregistrement");
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
            <div className="px-6 py-5 border-b border-gray-200 flex justify-center">
              {!editUser && (
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={UserAvatar}
                    alt="Nouvel Utilisateur"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              {editUser && (
                <h2 className="text-lg font-semibold text-gray-800">
                  Modifier l'utilisateur
                </h2>
              )}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 hover:bg-gray-100 rounded-md p-1 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="block w-full py-2.5 pl-10 pr-3 border border-gray-300 text-gray-900 rounded-md focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Nom"
                />
              </div>

              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 17h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="block w-full py-2.5 pl-10 pr-3 border border-gray-300 text-gray-900 rounded-md focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Email"
                />
              </div>

              {!editUser && (
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="block w-full py-2.5 pl-10 pr-3 border border-gray-300 text-gray-900 rounded-md focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Mot de passe"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 sr-only"
                >
                  Rôle
                </label>
                <div className="relative rounded-md shadow-sm">
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2.5 pl-3 pr-10 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm appearance-none"
                  >
                    <option value="admin">Administrateur</option>
                    <option value="recruteur">Recruteur</option>
                    <option value="etudiant">Étudiant</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 flex justify-center">
              <button
                onClick={handleSubmit}
                className="inline-flex items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-500 text-sm font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-pink-500 focus:ring-offset-2 transition-colors"
              >
                {editUser ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalUserForm;
