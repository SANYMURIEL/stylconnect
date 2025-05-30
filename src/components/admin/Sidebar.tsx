
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FaUsers, FaFileAlt, FaNewspaper, FaArrowLeft } from "react-icons/fa"; // Utilisez les icônes Fa

const sidebarItems = [
  { href: "/admin/users", label: "Utilisateurs", icon: FaUsers },
  { href: "/admin/publications", label: "Publications", icon: FaFileAlt },
  { href: "/admin/actualites", label: "Actualités", icon: FaNewspaper },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-pink-700 text-white shadow-lg flex flex-col justify-between p-4 z-50">
      <div>
        <Link
          href="/"
          className="text-xl font-bold text-center block py-4 mb-6"
        >
          Styl'Connect
        </Link>

        <nav className="space-y-2">
          {sidebarItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${
                  isActive ? "bg-pink-600" : "hover:bg-pink-600 opacity-75"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <Link
        href="/"
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-pink-500 hover:bg-pink-400 transition"
      >
        <FaArrowLeft className="w-4 h-4" />
        Retour
      </Link>
    </aside>
  );
};

export default Sidebar;