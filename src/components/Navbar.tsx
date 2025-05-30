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
  FaUserCog,
  FaBars,
  FaTimes,
  FaTachometerAlt,
} from "react-icons/fa";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navItems = [
    { href: "/", label: "Accueil", icon: <FaHome /> },
    { href: "/creations", label: "Créations", icon: <FaPalette /> },
    { href: "/actualites", label: "Actualités", icon: <FaNewspaper /> },
    { href: "/apropos", label: "À propos", icon: <FaInfoCircle /> },
    ...(status === "loading" || !isClient
      ? []
      : session?.user?.role === "admin"
      ? [{ href: "/admin/users", label: "Admin", icon: <FaUserCog /> }]
      : []),
    ...(status === "loading" || !isClient
      ? []
      : session?.user
      ? [{ href: "/opportunites", label: "Opportunités", icon: <FaBullhorn /> }]
      : []),
    ...(status === "loading" || !isClient
      ? []
      : session?.user?.role === "recruteur"
      ? [
          {
            href: "/recruteur/offres",
            label: "Tableau de bord",
            icon: <FaTachometerAlt />,
          },
        ]
      : []),
    ...(status === "loading" || !isClient
      ? []
      : session?.user?.role === "etudiant"
      ? [
          {
            href: "/etudiant/profil",
            label: "Tableau de bord",
            icon: <FaTachometerAlt />,
          },
        ]
      : []),
  ].filter(Boolean);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold text-pink-600 tracking-tight"
        >
          Styl’Connect
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-x-6">
            {navItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition font-semibold text-sm ${
                  pathname === href
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                {icon}
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Auth / Dropdown */}
        <div className="hidden md:flex items-center gap-4">
          {status === "loading" || !isClient ? (
            <svg
              className="animate-spin h-5 w-5 text-pink-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
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
        <div className="md:hidden bg-white px-6 pb-4 shadow-md">
          <div className="flex flex-col items-center gap-4">
            {navItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
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

            {status === "loading" || !isClient ? (
              <div className="flex justify-center py-2">
                <svg
                  className="animate-spin h-5 w-5 text-pink-500"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : !session?.user ? (
              <>
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
              </>
            ) : (
              <UserDropdown />
            )}
          </div>
        </div>
      )}
    </header>
  );
}
