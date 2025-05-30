"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaPencilAlt,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { motion } from "framer-motion";

interface User {
  _id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  bio?: string | null;
}

const ProfilForm = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<User>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<User>({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/etudiant/profile`);
          if (res.ok) {
            const data = await res.json();
            setUserData(data);
            setFormValues(data);
          } else {
            const errorData = await res.json();
            setError(
              `Erreur lors de la récupération du profil: ${
                errorData?.message || res.statusText
              }`
            );
          }
        } catch (err: any) {
          setError("Impossible de contacter le serveur.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [session?.user?.email]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormValues(userData);
  };

  const handleUpdateProfile = async () => {
    if (!userData?._id) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/etudiant/profile/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formValues.name,
          bio: formValues.bio,
          
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        const updatedData = await res.json();
        setUserData(updatedData);
        setFormValues(updatedData);
        alert("Profil mis à jour avec succès !");

        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedData.name,
            image: updatedData.image || session?.user?.image,
            bio: updatedData.bio || session?.user?.bio,
          },
        });
        
      } else {
        const errorData = await res.json();
        alert(
          `Erreur lors de la mise à jour du profil: ${
            errorData?.message || res.statusText
          }`
        );
      }
    } catch (err) {
      alert("Erreur de connexion lors de la mise à jour.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div>Chargement du profil...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <motion.div
      className="animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-pink-800 mb-2 flex items-center gap-2"
        >
          <FaUser className="text-pink-500" /> Nom
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formValues.name || ""}
          onChange={handleInputChange}
          className="shadow-sm bg-pink-50 border border-pink-300 text-gray-900 text-sm rounded-lg focus:ring-pink-505 focus:border-pink-500 block w-full p-2.5"
          disabled={!isEditing}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-pink-800 mb-2 flex items-center gap-2"
        >
          <FaEnvelope className="text-pink-500" /> Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email || ""}
          className="shadow-sm bg-pink-50 border border-pink-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5"
          disabled
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="bio"
          className="block text-sm font-semibold text-pink-800 mb-2 flex items-center gap-2"
        >
          <FaPencilAlt className="text-pink-500" /> Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formValues.bio || ""}
          onChange={handleInputChange}
          className="shadow-sm bg-pink-50 border border-pink-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5 h-24"
          disabled={!isEditing}
        />
      </div>

      <div className="mt-6 flex justify-start gap-3">
        {!isEditing ? (
          <motion.button
            onClick={handleEditClick}
            className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 font-semibold shadow-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPencilAlt className="mr-2" /> Modifier
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <motion.button
              onClick={handleUpdateProfile}
              className={`inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold shadow-sm transition-colors ${
                isUpdating ? "opacity-50 cursor-not-allowed animate-pulse" : ""
              }`}
              disabled={isUpdating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isUpdating ? (
                <>
                  <AiOutlineLoading className="animate-spin mr-2" />{" "}
                  Enregistrement...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" /> Enregistrer
                </>
              )}
            </motion.button>
            <motion.button
              onClick={handleCancelClick}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 font-semibold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTimes className="mr-2" /> Annuler
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilForm;