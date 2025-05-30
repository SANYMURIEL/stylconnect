"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarEtudiant from "@/components/etudiant/SidebarEtudiant"; // Créez ce composant si vous ne l'avez pas
import ProjetEtudiantList from "@/components/etudiant/projets/ProjetEtudiantList";
import { motion } from "framer-motion";
import { LightBulbIcon } from "@heroicons/react/24/outline";

const EtudiantProjetsPage = () => {
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

  const loadingVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center h-screen bg-gray-100 text-pink-500 font-semibold text-lg"
        variants={loadingVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        Chargement des projets...
        <LightBulbIcon className="ml-2 w-6 h-6 animate-pulse" />
      </motion.div>
    );
  }

  if (!isEtudiant) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-red-500 font-semibold text-lg">
        Accès non autorisé.
      </div>
    );
  }

  const containerVariants = {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", delay: 0.2, damping: 20, stiffness: 100 },
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <SidebarEtudiant />

      {/* Main content */}
      <motion.div
        className="flex-1 ml-0 md:ml-64 p-6 md:p-10"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="mb-6 flex items-center gap-2">
          <LightBulbIcon className="w-8 h-8 text-pink-500" />
          <h1 className="text-2xl font-semibold text-pink-500">
            Mes Projets Étudiants
          </h1>
        </div>
        <ProjetEtudiantList />
      </motion.div>
    </div>
  );
};

export default EtudiantProjetsPage;
