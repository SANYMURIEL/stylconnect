"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarRecruteur from "@/components/recruteur/SidebarRecruteur"; // Assurez-vous que le chemin est correct
import OffreList from "@/components/recruteur/offres/OffreList"; // Assurez-vous que le chemin est correct
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const RecruteurOffresPage = () => {
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
        Chargement des offres...{" "}
        <Briefcase className="ml-2 w-6 h-6 animate-pulse" />
      </motion.div>
    );
  }

  if (!isRecruteur) {
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
      <SidebarRecruteur />

      {/* Main content */}
      <motion.div
        className="flex-1 ml-64 p-6 md:p-10"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <h1 className="text-2xl font-semibold text-pink-500 mb-6">
          Gestion de mes Offres
        </h1>
        <OffreList />
      </motion.div>
    </div>
  );
};

export default RecruteurOffresPage;
