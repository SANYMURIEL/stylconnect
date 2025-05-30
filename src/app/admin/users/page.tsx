
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import UserList from "@/components/admin/users/UserList";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FaUsers, FaBriefcase, FaShieldAlt, FaGraduationCap } from 'react-icons/fa'; // Importez plus d'icônes

async function fetchUserCounts() {
  try {
    const res = await fetch("/api/admin/users/counts"); // Nouvelle route API pour obtenir les comptes
    if (!res.ok) {
      console.error("Erreur lors de la récupération des comptes d'utilisateurs:", res.status);
      return { etudiant: 0, recruteur: 0, admin: 0 };
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des comptes d'utilisateurs:", error);
    return { etudiant: 0, recruteur: 0, admin: 0 };
  }
}

const AdminUsersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userCounts, setUserCounts] = useState({ etudiant: 0, recruteur: 0, admin: 0 });

  useEffect(() => {
    const checkAdmin = async () => {
      if (status === "loading") {
        setLoading(true);
        return;
      }
      setLoading(false);

      if (session?.user?.role !== "admin") {
        router.push("/");
      } else {
        setIsAdmin(true);
        const counts = await fetchUserCounts();
        setUserCounts(counts);
      }
    };

    checkAdmin();
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
        Chargement... <Sparkles className="ml-2 w-6 h-6 animate-pulse" />
      </motion.div>
    );
  }

  if (!isAdmin) {
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
      <Sidebar />

      {/* Contenu principal */}
      <motion.div
        className="flex-1 ml-60 p-6 md:p-10" // Marge ajustée pour correspondre à la largeur de la barre latérale
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-pink-100 text-pink-700 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>Étudiants</div>
            <div className="font-bold text-xl">{userCounts.etudiant}</div>
            <FaGraduationCap className="text-2xl opacity-50" />
          </div>
          <div className="bg-pink-100 text-pink-700 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>Recruteurs</div>
            <div className="font-bold text-xl">{userCounts.recruteur}</div>
            <FaBriefcase className="text-2xl opacity-50" />
          </div>
          <div className="bg-pink-100 text-pink-700 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>Admins</div>
            <div className="font-bold text-xl">{userCounts.admin}</div>
            <FaShieldAlt className="text-2xl opacity-50" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestion des Utilisateurs</h2>
          <UserList />
        </div>
      </motion.div>
    </div>
  );
};

export default AdminUsersPage;