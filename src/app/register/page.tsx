"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi"; 
import Image from "next/image";
import RegisterIllustration from "../../../public/images/re.png";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    if (res.ok) router.push("/login");
    else setError(result.error || "Erreur d'inscription.");
  };

  return (
    <main className="bg-white">
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-24">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col lg:flex-row">
          {/* Partie gauche avec illustration */}
          <div className="relative lg:w-1/2 flex flex-col justify-end bg-pink-500">
            <div className="absolute inset-0 z-0">
              <Image
                src={RegisterIllustration}
                alt="Découvrez nos créations"
                layout="fill"
                objectFit="cover"
                className="opacity-95"
              />
            </div>
            <div className="relative z-10 bg-gradient-to-t from-gray-800/80 to-transparent p-6 text-white">
              <h2 className="text-2xl font-bold">Styl’Connect</h2>
              <p className="text-sm">
                Devenez membre de Styl'Connect, la plateforme des créations
                étudiantes du CFPD.
              </p>
            </div>
          </div>

          {/* Partie droite avec le formulaire */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-pink-500 relative inline-block">
                Inscription
                <span className="block h-1 bg-pink-200 rounded-full w-full mt-1"></span>
              </h2>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 text-sm text-red-700 bg-red-100 border border-red-200 px-3 py-2 rounded-md shadow-sm transition-all duration-300">
                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Champ Nom */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Nom
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiUser />
                  </span>
                  <input
                    type="text"
                    placeholder="Nom complet"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="pl-10 text-gray-800 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                  />
                </div>
              </div>

              {/* Champ Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiMail />
                  </span>
                  <input
                    type="email"
                    placeholder="ex: styliste@cfpd.com"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="pl-10 text-gray-800 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="pl-10 pr-10 text-gray-800 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-pink-500"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    required
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    className="pl-10 pr-10 text-gray-800 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-pink-500"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Bouton S'inscrire */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-transform transform hover:scale-105 duration-150"
              >
                S’inscrire
              </button>
            </form>

            {/* Lien vers login */}
            <div className="mt-5 text-center text-sm text-gray-600">
              <p>
                Vous avez déjà un compte ?{" "}
                <a
                  href="/login"
                  className="text-pink-500 hover:underline font-medium"
                >
                  Connectez-vous ici
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
