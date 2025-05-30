"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SidebarEtudiant from "@/components/etudiant/SidebarEtudiant";
import ProfilForm from "@/components/etudiant/profil/ProfilForm";
import ChangePasswordForm from "@/components/etudiant/profil/ChangePasswordForm";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUserCog } from "react-icons/fa";
import { AiOutlineLoading, AiOutlineWarning } from "react-icons/ai";
import { FaShieldAlt } from "react-icons/fa";

const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", delay: 0.2, damping: 18, stiffness: 120 },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.15 } },
};

const ProfilEtudiantPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEtudiant, setIsEtudiant] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }
    setLoading(false);

    if (session?.user?.role !== "etudiant") {
      router.push("/");
    } else {
      setIsEtudiant(true);
    }
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <AiOutlineLoading className="animate-spin text-3xl text-pink-500" />
      </div>
    );
  }

  if (!isEtudiant) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-red-500">
        <AiOutlineWarning className="text-4xl mr-2 animate-pulse" /> Accès non
        autorisé.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <SidebarEtudiant />
      <motion.div
        className="flex-1 ml-0 md:ml-60 p-6 md:p-8"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="mb-8 flex items-center gap-4">
          <FaUserCog className="text-3xl text-pink-500 animate-spin" />
          <h2 className="text-3xl font-semibold text-pink-700">
            <span className="bg-pink-100 text-pink-700 py-1 px-3 rounded-full shadow-sm">
              Mon Profil
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-pink-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-pink-600 mb-4 border-b-2 border-pink-300 pb-2 flex items-center gap-2">
                <FaUserCog className="text-pink-400" /> Informations
                Personnelles
              </h3>
              <ProfilForm />
            </div>
          </motion.div>
          <motion.div
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-pink-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-pink-600 mb-4 border-b-2 border-pink-300 pb-2 flex items-center gap-2">
                <FaShieldAlt className="text-pink-400" /> Sécurité
              </h3>
              <ChangePasswordForm />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilEtudiantPage;
