"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import AdminOffreList from "@/components/admin/offres/AdminOffreList";
import { motion } from "framer-motion";
import { BriefcaseIcon } from "@heroicons/react/24/outline";

const AdminOffresPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }
    setLoading(false);

    if (session?.user?.role !== "admin") {
      router.push("/");
    } else {
      setIsAdmin(true);
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
        className="flex items-center justify-center h-screen bg-gray-50 text-pink-500 font-semibold text-lg"
        variants={loadingVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <BriefcaseIcon className="mr-3 w-8 h-8 animate-spin" />
        Chargement des offres...
      </motion.div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-red-500 font-semibold text-lg">
        <svg
          className="mr-3 w-8 h-8 animate-bounce text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        Accès non autorisé.
      </div>
    );
  }

  const containerVariants = {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", delay: 0.1, damping: 18, stiffness: 120 },
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex">
      {/* Sidebar */}
      <div className="md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <motion.div
        className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col h-full"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="mb-6 flex items-center gap-3">
          <BriefcaseIcon className="w-8 h-8 text-pink-500 animate-pulse" />
          <h1 className="text-2xl font-semibold text-pink-600">
            Gestion des Offres
          </h1>
        </div>
        <AdminOffreList />
      </motion.div>
    </div>
  );
};

export default AdminOffresPage;
