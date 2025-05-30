
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SidebarRecruteur from "@/components/recruteur/SidebarRecruteur";
import ProfilForm from "@/components/recruteur/profil/ProfilForm";
import ChangePasswordForm from "@/components/recruteur/profil/ChangePasswordForm"; 
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUserCog } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai"; 

const ProfilRecruteurPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRecruteur, setIsRecruteur] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }
    setLoading(false);

    if (session?.user?.role !== "recruteur") {
      router.push("/");
    } else {
      setIsRecruteur(true);
    }
  }, [session, status, router]);

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", delay: 0.2, damping: 18, stiffness: 120 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.15 } },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <AiOutlineLoading className="animate-spin text-3xl text-pink-500" />
      </div>
    );
  }

  if (!isRecruteur) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-red-500">
        Accès non autorisé.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
      <SidebarRecruteur />
      <motion.div
        className="flex-1 ml-60 p-8 md:p-12"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="mb-8 flex items-center gap-4">
          <FaUserCog className="text-3xl text-pink-500" />
          <h2 className="text-3xl font-semibold text-pink-600">
            Gestion du Profil
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 animate-slide-in-left">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-pink-500 mb-4 border-b pb-2">
                Informations Personnelles
              </h3>
              <ProfilForm />
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 animate-slide-in-right">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-pink-500 mb-4 border-b pb-2">
                Sécurité
              </h3>
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilRecruteurPage;
