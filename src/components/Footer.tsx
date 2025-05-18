"use client";

import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-pink-50 text-gray-700 border-t border-pink-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo et description */}
        <div>
          <Link
            href="/"
            className="text-3xl font-extrabold text-pink-600 hover:text-pink-700 tracking-tight"
          >
            Styl’Connect
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            Plateforme de valorisation des créations des étudiants du CFPD-ISGD
            et mise en réseau avec les entreprises.
          </p>
        </div>

        {/* Liens rapides */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Liens utiles
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/creations"
                className="hover:text-pink-600 transition"
              >
                Créations
              </Link>
            </li>
            <li>
              <Link
                href="/opportunites"
                className="hover:text-pink-600 transition"
              >
                Opportunités
              </Link>
            </li>
            <li>
              <Link
                href="/actualites"
                className="hover:text-pink-600 transition"
              >
                Actualités
              </Link>
            </li>
            <li>
              <Link href="/apropos" className="hover:text-pink-600 transition">
                À propos
              </Link>
            </li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Suivez-nous
          </h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800 transition"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800 transition"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800 transition"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="mailto:contact@stylconnect.com"
              className="text-pink-600 hover:text-pink-800 transition"
            >
              <FaEnvelope size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-pink-100 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Styl’Connect — Tous droits réservés.
      </div>
    </footer>
  );
}
