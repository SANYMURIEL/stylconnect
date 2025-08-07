"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";
import {
  FaHome,
  FaPalette,
  FaBullhorn,
  FaNewspaper,
  FaInfoCircle,
  FaTachometerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { PiUsersThreeBold } from "react-icons/pi";
import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <motion.div
    className="h-5 w-5 border-2 border-current border-t-transparent text-pink-500 rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
  />
);

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getDashboardLink = () => {
    if (session?.user?.role === "admin") {
      return { href: "/admin/users", label: "Tableau de bord", icon: <PiUsersThreeBold /> };
    }
    if (session?.user?.role === "recruteur") {
      return { href: "/recruteur/offres", label: "Tableau de bord", icon: <FaTachometerAlt /> };
    }
    if (session?.user?.role === "etudiant") {
      return { href: "/etudiant/profil", label: "Tableau de bord", icon: <FaTachometerAlt /> };
    }
    return null;
  };

  const navItems = [
    { href: "/", label: "Accueil", icon: <FaHome /> },
    { href: "/creations", label: "Créations", icon: <FaPalette /> },
    { href: "/actualites", label: "Actualités", icon: <FaNewspaper /> },
    { href: "/opportunites", label: "Opportunités", icon: <FaBullhorn /> },
    { href: "/apropos", label: "À propos", icon: <FaInfoCircle /> },
  ].filter(Boolean);

  const finalNavItems = isClient && session?.user
    ? [
      ...navItems.slice(0, 3), // Accueil, Créations, Actualités
      ...(session.user.role !== 'recruteur' ? [navItems[3]] : []), // Opportunités (sauf si recruteur)
      ...(getDashboardLink() ? [getDashboardLink()] : []), // Tableau de bord
      navItems[4], // À propos
    ]
    : navItems.filter(item => item.href !== "/opportunites");

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold text-pink-600 tracking-tight whitespace-nowrap"
        >
          Styl’Connect
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-x-4">
            {finalNavItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1 px-3 py-2 rounded-full transition-colors duration-200 font-semibold text-sm ${
                  pathname === href
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                {icon}
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Auth / Dropdown */}
        <div className="hidden md:flex items-center gap-4">
          {status === "loading" || !isClient ? (
            <div className="flex justify-center items-center h-10 w-24">
              <LoadingSpinner />
            </div>
          ) : !session?.user ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 border border-pink-600 text-pink-600 rounded-full hover:bg-pink-50 transition font-semibold text-sm"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition font-semibold text-sm"
              >
                Inscription
              </Link>
            </>
          ) : (
            <UserDropdown />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-pink-600 focus:outline-none"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pb-4 shadow-md transition-all duration-300 ease-in-out">
          <div className="flex flex-col items-center gap-4">
            {finalNavItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 w-full px-4 py-2 rounded-md transition font-semibold ${
                  pathname === href
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                {icon}
                {label}
              </Link>
            ))}

            <div className="w-full h-px bg-gray-200 my-2"></div>

            {status === "loading" || !isClient ? (
              <div className="flex justify-center py-2">
                <LoadingSpinner />
              </div>
            ) : !session?.user ? (
              <div className="flex flex-col gap-2 w-full">
                <Link
                  href="/login"
                  className="w-full px-4 py-2 border border-pink-600 text-pink-600 rounded-md text-center hover:bg-pink-50"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="w-full px-4 py-2 bg-pink-600 text-white rounded-md text-center hover:bg-pink-700"
                >
                  Inscription
                </Link>
              </div>
            ) : (
              <UserDropdown mobile />
            )}
          </div>
        </div>
      )}
    </header>
  );
}