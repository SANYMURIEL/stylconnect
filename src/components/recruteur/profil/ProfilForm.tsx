"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaCheck,
  FaTimes,
  FaPencilAlt,
} from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";

interface User {
  _id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  typeEntreprise?: string | null;
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
  const [isEntreprise, setIsEntreprise] = useState(false);
  const [isParticulier, setIsParticulier] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/recruteur/profile`);
          if (res.ok) {
            const data = await res.json();
            setUserData(data);
            setFormValues(data);
            setIsEntreprise(data.typeEntreprise === "entreprise");
            setIsParticulier(data.typeEntreprise === "particulier");
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "entreprise" && checked) {
      setIsEntreprise(true);
      setIsParticulier(false);
      setFormValues({ ...formValues, typeEntreprise: "entreprise" });
    } else if (name === "particulier" && checked) {
      setIsParticulier(true);
      setIsEntreprise(false);
      setFormValues({ ...formValues, typeEntreprise: "particulier" });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormValues(userData);
    setIsEntreprise(userData.typeEntreprise === "entreprise");
    setIsParticulier(userData.typeEntreprise === "particulier");
  };

  const handleUpdateProfile = async () => {
    if (!userData?._id) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/recruteur/profile/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formValues.name,
          typeEntreprise: formValues.typeEntreprise,
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
            typeEntreprise:
              updatedData.typeEntreprise || session?.user?.typeEntreprise,
           
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
    <div className="animate-fade-in">
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-pink-700 mb-2 flex items-center gap-2"
        >
          <FaUser className="text-pink-400" /> Nom
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formValues.name || ""}
          onChange={handleInputChange}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5"
          disabled={!isEditing}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-pink-700 mb-2 flex items-center gap-2"
        >
          <FaEnvelope className="text-pink-400" /> Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email || ""}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5"
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-pink-700 mb-2">
          Type de recruteur
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              id="entreprise"
              type="checkbox"
              name="entreprise"
              className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={isEntreprise && isEditing}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
            />
            <label
              htmlFor="entreprise"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Entreprise
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="particulier"
              type="checkbox"
              name="particulier"
              className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={isParticulier && isEditing}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
            />
            <label
              htmlFor="particulier"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Particulier
            </label>
          </div>
        </div>
      </div>
      {/* Ajoutez d'autres champs de votre modèle User ici */}
      {isEditing && (
        <div className="mb-4">
          <label
            htmlFor="bio"
            className="block text-sm font-semibold text-pink-700 mb-2 flex items-center gap-2"
          >
            <FaPencilAlt className="text-pink-400" /> Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formValues.bio || ""}
            onChange={handleInputChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5 h-24"
          />
        </div>
      )}
      <div className="mt-6 flex justify-start gap-3">
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 font-semibold shadow-sm transition-colors"
          >
            <FaPencilAlt className="mr-2" /> Modifier
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleUpdateProfile}
              className={`inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold shadow-sm transition-colors ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isUpdating}
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
            </button>
            <button
              onClick={handleCancelClick}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 font-semibold transition-colors"
            >
              <FaTimes className="mr-2" /> Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilForm;