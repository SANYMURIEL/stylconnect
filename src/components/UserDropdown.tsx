"use client";
import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiLogOut, FiTag } from "react-icons/fi";
import Image from "next/image";
import img from "../../public/images/default.png";

interface UserDropdownProps {
  mobile?: boolean;
}

export default function UserDropdown({ mobile = false }: UserDropdownProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  if (!user) return null;

  return (
    <div className={`relative ${mobile ? 'w-full' : 'ml-4'}`} ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between gap-2 px-4 py-2 bg-pink-100 hover:bg-pink-200 rounded-full text-sm font-medium text-pink-700 transition ${mobile ? 'w-full' : ''}`}
      >
        <div className="flex items-center gap-2">
          <Image
            src={user.image || img}
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <span className="hidden sm:inline-block md:inline-block whitespace-nowrap">{user.name}</span>
        </div>
        <FiChevronDown className={`text-pink-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className={`absolute ${mobile ? 'static' : 'right-0'} mt-2 w-full md:w-64 bg-white border border-gray-200 shadow-xl rounded-xl z-20 p-4 animate-fadeIn`}>
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            {user.role && (
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                <FiTag className="text-gray-400" size={14} />
                <span
                  className={`font-medium ${
                    user.role === "admin"
                      ? "text-red-500"
                      : user.role === "etudiant"
                      ? "text-blue-500"
                      : "text-green-500"
                  }`}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </p>
            )}
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