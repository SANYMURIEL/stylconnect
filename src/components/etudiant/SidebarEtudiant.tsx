"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaUserCircle,
  FaPlusSquare, 
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";
import Image from "next/image";

import defaultProfileImage from "../../../public/images/default.png";

const sidebarItemsEtudiant = [
  { href: "/etudiant/profil", label: "Gérer Profil", icon: FaUserCircle },
  { href: "/etudiant/creations", label: "Mes Créations", icon: FaPlusSquare },
  { href: "/etudiant/messages", label: "Messages", icon: FaEnvelope },
];

const SidebarEtudiant = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-pink-700 text-white shadow-lg flex flex-col justify-between p-4 z-50">
      <div>
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-pink-500">
            <Image
              src={defaultProfileImage}
              alt={user?.name || "Profil"}
              layout="fill"
              objectFit="cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultProfileImage.src;
              }}
            />
          </div>
          {user?.name && (
            <span className="text-sm font-semibold mt-2">{user.name}</span>
          )}
          {!user?.name && (
            <span className="text-sm font-semibold mt-2">Étudiant</span>
          )}
        </div>

        <nav className="space-y-2">
          {sidebarItemsEtudiant.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
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
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-pink-500 hover:bg-pink-400 transition mt-4"
      >
        <FaArrowLeft className="w-4 h-4" />
        Retour
      </Link>
    </aside>
  );
};

export default SidebarEtudiant;
