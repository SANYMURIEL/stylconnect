"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  FaUserCircle,
  FaTshirt,
  FaPaintBrush,
  FaEye,
  FaUserPlus,
} from "react-icons/fa";

import Image from "next/image";
import HeroImage from "../../public/images/hero.png";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-pink-100 to-white min-h-screen ">
        {/* Section Hero centrée */}
        <section className="flex items-center justify-center min-h-[calc(100vh-96px)] px-6 md:px-12 lg:px-20">
          <div className="grid md:grid-cols-2 gap-10 items-center max-w-7xl w-full">
            {/* Texte + Boutons */}
            <div className="text-center md:text-left space-y-6">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight">
                Bienvenue sur{" "}
                <span className="text-pink-600">Styl’Connect</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600">
                La plateforme pour valoriser la créativité étudiantedu{" "}
                <strong>CFPD</strong>.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 pt-4">
                <a
                  href="/galerie"
                  className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-pink-700 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <FaEye /> Voir les créations
                </a>

                <a
                  href="/register"
                  className="flex items-center gap-2 bg-pink-100 text-pink-700 px-6 py-3 rounded-full text-base font-medium hover:bg-pink-200 hover:scale-105 transition-all duration-300 shadow"
                >
                  <FaUserPlus /> S’inscrire
                </a>
              </div>
            </div>

            {/* Image animée */}
            <div className="w-[280px] md:w-[350px] mx-auto transition-transform duration-500 ease-in-out hover:scale-105">
              <Image
                src={HeroImage}
                alt="Illustration Styl'Connect"
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </section>
        {/* Section Nos Talents à la Une */}

        {/* <Footer /> */}
      </main>
    </>
  );
}
