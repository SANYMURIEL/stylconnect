"use client";
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import Image from "next/image";
import Map from "@/components/Map";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import fondatrice from "../../../public/images/mme_deutou.png";
import plan from "../../../public/images/image.png";
import logo1 from "../../../public/images/logocfpd.png";
import logo2 from "../../../public/images/logoisgd1.png";
import contact from "../../../public/images/contact-us.jpg";
import stylisme from "../../../public/images/stylisme.jpg";
import modelisme from "../../../public/images/modelisme.jpg";
import deco from "../../../public/images/deco.png";
export default function AproposPage() {
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            setVisibleSections((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".section").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const sectionClass = (index: number) =>
    `section transition-all duration-700 ease-in-out ${
      visibleSections.includes(index)
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-10"
    }`;

  return (
    <main className="bg-white text-gray-800">
      <Navbar />

      <div className="pt-24 px-4 md:px-16 space-y-20">
        {/* Hero */}
        <section className="flex flex-col lg:flex-row items-center justify-center text-center lg:text-left max-w-6xl mx-auto px-6 py-12 gap-8  ">
          {/* Image gauche */}
          <div className="hidden lg:block  relative  overflow-hidden ">
            <Image
              src={logo2}
              alt="Image gauche"
              width={320}
              height={200}
              className="object-cover"
            />
          </div>

          {/* Texte central */}
          <div className="lg:w-2/4 px-4">
            <h2 className="text-4xl font-extrabold text-pink-600 mb-4">
              À propos du CFPD-ISGD
            </h2>
            <p className="text-gray-700 max-w-xl mx-auto lg:mx-0 text-lg">
              Découvrez notre univers où la passion de la mode rencontre
              l’excellence de la formation.
            </p>
          </div>

          {/* Image droite */}
          <div className="hidden lg:block lg:w-1/4 relative  overflow-hidden ">
            <Image
              src={logo1}
              alt="Image droite"
              width={320}
              height={200}
              className="object-cover"
            />
          </div>
        </section>

        {/* Historique */}
        <section className={sectionClass(1)} data-index="1">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="w-80 max-w-xs mx-auto">
              <Image
                src={fondatrice}
                alt="Fondatrice"
                layout="responsive"
                className="rounded-xl shadow-lg object-cover"
                priority
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-pink-600 mb-2">
                Notre Histoire
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Fondé en 2004 par Madame DEUTOU Martine, le CFPD s’est imposé
                comme une référence dans la formation en mode. Alliant théorie
                et pratique, il forme des stylistes et créateurs passionnés.
              </p>
            </div>
          </div>
        </section>

        {/* Fiche + Localisation */}
        <section className={sectionClass(2)} data-index="2">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold text-pink-600 mb-3 flex items-center gap-2">
                <FaBuilding /> Identification
              </h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <strong>Nom :</strong> CFPD-ISGD
                </li>
                <li>
                  <strong>Adresse :</strong> Makepe Bloc F, Douala
                </li>
                <li>
                  <strong>Date :</strong> 2004
                </li>
                <li>
                  <strong>Statut :</strong> EIRL
                </li>
                <li>
                  <strong>Tél :</strong> +237 696 42 11 96 / 653 14 99 62
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold text-pink-600 mb-3 flex items-center gap-2">
                <FaMapMarkerAlt /> Localisation
              </h3>
              <p className="text-sm">
                Le CFPD-ISGD est situé à Makepe Petit Pays, lieu-dit Compteur
                Rouge.
              </p>
              <div className="mt-4">
                <Map/>
              </div>
            </div>
          </div>
        </section>

        {/* Filières */}
        <section className={sectionClass(3)} data-index="3">
          <h3 className="text-2xl font-bold text-center text-pink-600 mb-10">
            Nos Filières
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Stylisme-Modélisme */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Image
                src={stylisme}
                alt="Stylisme-Modélisme"
                width={400}
                height={250}
                className="w-full object-cover h-52"
              />
              <div className="p-4">
                <h4 className="font-bold text-lg text-pink-600 mb-2">
                  Stylisme-Modélisme
                </h4>
                <p className="text-sm text-gray-600">
                  Création de mode, art, teinture, communication, stage sur 3
                  ans.
                </p>
              </div>
            </div>

            {/* Modélisme */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Image
                src={modelisme}
                alt="Modélisme"
                width={400}
                height={250}
                className="w-full object-cover h-52"
              />
              <div className="p-4">
                <h4 className="font-bold text-lg text-pink-600 mb-2">
                  Modélisme
                </h4>
                <p className="text-sm text-gray-600">
                  Conception technique, prêt-à-porter et sur-mesure.
                </p>
              </div>
            </div>

            {/* Décoration */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Image
                src={deco}
                alt="Décoration"
                width={400}
                height={250}
                className="w-full object-cover h-52"
              />
              <div className="p-4">
                <h4 className="font-bold text-lg text-pink-600 mb-2">
                  Décoration
                </h4>
                <p className="text-sm text-gray-600">
                  Devenez décorateur d’intérieur événementiel – formation de 2
                  ans.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={sectionClass(4)} data-index="4">
          <div className="grid md:grid-cols-2 gap-12 items-center py-16">
            <div className="px-4 sm:px-0">
              <h3 className="text-3xl font-semibold text-pink-600 mb-6">
                Contactez-nous
              </h3>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Votre nom"
                    className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Votre adresse email"
                    className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Votre message"
                    className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4"
                  ></textarea>
                </div>
                <div className="flex justify-start">
                  {" "}
                  {/* Centrage du bouton à gauche (ou changez en justify-center pour le centrer) */}
                  <button className="bg-pink-500 text-white py-3 px-8 rounded-full hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 font-semibold transition-colors duration-200">
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
            <div className="px-4 sm:px-0">
              <Image
                src={contact}
                alt="Contact CFPD"
                width={600}
                height={400}
                className="rounded-xl shadow-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
