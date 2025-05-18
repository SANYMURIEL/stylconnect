"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import Image from "next/image";
import loginImage from "../../../public/images/okk.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Identifiants incorrects.");
    } else if (res?.ok) {
      router.push("/");
    }
  };

  return (
    <main className="bg-white">
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-24">
        <div className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col lg:flex-row">
          {/* Image */}
          <div className="relative lg:w-1/2 hidden lg:block">
            <Image
              src={loginImage}
              alt="Illustration"
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 text-white">
              <div>
                <h2 className="text-3xl font-extrabold">Styl’Connect</h2>
                <p className="text-sm">
                  Connectez-vous pour découvrir les projets des étudiants du
                  CFPD .
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-pink-500 relative inline-block">
                Connexion
                <span className="block h-2 bg-pink-200 rounded-full w-full mt-1"></span>
              </h2>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 text-sm text-red-700 bg-red-100 border border-red-200 px-3 py-2 rounded-md shadow-sm transition-all duration-300">
                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiUser />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ex: styliste@cfpd.com"
                    className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Mot de passe
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <FiLock />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-gray-800"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-pink-500 focus:outline-none"
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

              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-transform transform hover:scale-105 duration-150"
                >
                  Se connecter
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <Link
                href="/forgot-password"
                className="hover:underline text-pink-500"
              >
                Mot de passe oublié ?
              </Link>
              <p className="mt-2">
                Pas encore de compte ?
                <Link
                  href="/register"
                  className="font-semibold text-pink-500 hover:underline"
                >
                  Inscrivez-vous ici
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
