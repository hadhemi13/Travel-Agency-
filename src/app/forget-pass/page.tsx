"use client";
import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Code envoyé avec succès ! Vérifiez votre e-mail.");
        setStep("code");
      } else {
        setError(data.error || "Échec de l'envoi du code");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(data.error || "Échec de la réinitialisation");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* 🖼️ Left Image Section */}
            <div className="order-2 lg:order-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
              <div className="w-full max-w-md p-10">
                <Image
                  src="/assets/images/element/forgot-pass.svg"
                  alt="Forgot Password"
                  width={500}
                  height={500}
                  className="w-full h-auto"
                />
              </div>
              <div className="hidden lg:block w-px h-64 bg-gray-200 ml-8"></div>
            </div>

            {/* 🔐 Form Section */}
            <div className="order-1 lg:order-2 p-8 sm:p-12 lg:p-16">
              {/* Logo */}
              <div className="mb-8 flex items-center justify-center">
                <Link href="/">
                  <Image
                    src="/assets/images/logo-icon.svg"
                    alt="Logo"
                    width={60}
                    height={60}
                    className="rounded-xl"
                  />
                </Link>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                {step === "email"
                  ? "Mot de passe oublié ?"
                  : "Réinitialiser le mot de passe"}
              </h1>
              <p className="text-gray-600 mb-8">
                {step === "email"
                  ? "Entrez l'adresse e-mail associée à votre compte."
                  : "Entrez le code envoyé à votre e-mail et votre nouveau mot de passe."}
              </p>

              {/* ✅ Success / ❌ Error Messages */}
              {message && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm text-green-700">
                  {message}
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
                  {error}
                </div>
              )}

              {step === "email" ? (
                <form onSubmit={handleSendCode} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Adresse e-mail
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="nom@exemple.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? "Envoi en cours..." : "Envoyer le code"}
                  </button>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour à la connexion
                    </Link>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Code de réinitialisation
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      maxLength={6}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                      placeholder="123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading
                      ? "Réinitialisation..."
                      : "Réinitialiser le mot de passe"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Retour à l'e-mail
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
