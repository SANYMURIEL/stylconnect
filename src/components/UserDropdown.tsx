"use client";

import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import Image from "next/image";
import img from "../../public/images/default.png"
export default function UserDropdown({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-pink-100 hover:bg-pink-200 rounded-full text-sm font-medium text-pink-700 transition"
      >
        <Image
          src={user.image || img}
          alt="Avatar"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
        <span className="hidden sm:inline">{user.name}</span>
        <FiChevronDown className="text-pink-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-xl z-20 p-4 animate-fadeIn">
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Connecté à : {new Date().toLocaleTimeString()}
            </p>
          </div>

          <button
            onClick={() => signOut()}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition duration-150"
          >
            <FiLogOut size={16} />
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
