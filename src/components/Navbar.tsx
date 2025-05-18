"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";

import {
  FaHome,
  FaPalette,
  FaBullhorn,
  FaNewspaper,
  FaInfoCircle,
  FaUserCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const dashboardLink = () => {
    const role = session?.user?.role;
    if (role === "admin") return "/dashboard/admin";
    if (role === "etudiant") return "/dashboard/etudiant";
    if (role === "entreprise") return "/dashboard/entreprise";
    return "/dashboard";
  };

  const navItems = [
    { href: "/", label: "Accueil", icon: <FaHome /> },
    { href: "/creations", label: "Créations", icon: <FaPalette /> },
    { href: "/opportunites", label: "Opportunités", icon: <FaBullhorn /> },
    { href: "/actualites", label: "Actualités", icon: <FaNewspaper /> },
    { href: "/apropos", label: "À propos", icon: <FaInfoCircle /> },
  ];

  if (session) {
    navItems.push({
      href: dashboardLink(),
      label: "Tableau de bord",
      icon: <FaUserCog />,
    });
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/80 shadow-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold text-pink-600 hover:text-pink-700 transition tracking-tight"
        >
          Styl’Connect
        </Link>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-pink-600 focus:outline-none"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Nav Links */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center gap-6 font-semibold text-gray-700 text-sm absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none py-6 md:py-0 px-6 md:px-0 z-40 rounded-md md:rounded-none justify-center md:justify-center`}
        >
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-2 py-1 transition-all duration-200 font-bold ${
                pathname === href
                  ? "text-pink-600 underline underline-offset-8"
                  : "text-gray-700 hover:text-pink-600 hover:underline underline-offset-4"
              }`}
            >
              {icon}
              {label}
            </Link>
          ))}

          {/* Auth */}
          {!session ? (
            <div className="flex flex-col md:flex-row gap-3 md:ml-6 mt-4 md:mt-0">
              <Link
                href="/login"
                className="px-4 py-2 border border-pink-600 text-pink-600 rounded-full hover:bg-pink-50 transition duration-200 text-center font-semibold"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition duration-200 text-center font-semibold"
              >
                Inscription
              </Link>
            </div>
          ) : (
            <UserDropdown user={session.user} />
          )}
        </div>
      </nav>
    </header>
  );
}
