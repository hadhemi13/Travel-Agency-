"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  
  // Votre logique de validation actuelle
  const hasMinLength = password.length >= 8;
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const passwordsMatch = password === confirmpassword && password !== "";
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNameValid = name.trim().length > 0;

  const isFormValid =
    isNameValid &&
    isValidEmail &&
    hasMinLength &&
    hasLetters &&
    hasNumbers &&
    passwordsMatch;
  
  const showErrorPopup = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000);
  };
  
  const validateForm = () => {
    const errors: string[] = [];
    let errorMessage = "Veuillez vérifier les points suivants :\n\n";

    if (!isNameValid) {
      errors.push("name");
      errorMessage += "• Le nom est requis\n";
    }
    if (!isValidEmail) {
      errors.push("email");
      errorMessage += "• L'email n'est pas valide (format: exemple@mail.tn)\n";
    }
    if (!hasMinLength) {
      errors.push("password");
      errorMessage += "• Le mot de passe doit contenir au moins 8 caractères\n";
    }
    if (!hasLetters) {
      errors.push("password");
      errorMessage += "• Le mot de passe doit contenir des lettres\n";
    }
    if (!hasNumbers) {
      errors.push("password");
      errorMessage += "• Le mot de passe doit contenir des chiffres\n";
    }
    if (!passwordsMatch) {
      errors.push("confirmpassword");
      errorMessage += "• Les mots de passe ne correspondent pas\n";
    }

    return { isValid: errors.length === 0, errors, errorMessage };
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    const validation = validateForm();

    if (!validation.isValid) {
      setInvalidFields(validation.errors);
      showErrorPopup(validation.errorMessage);
      return;
    }
    setInvalidFields([]);

    try {
      const response = await axios.post("/api/register", {
        name,
        email,
        password,
      });
      if (response.data.error) {
        if (response.data.error === "User already existed") {
          setInvalidFields(["email"]);
          showErrorPopup(
            "Cet email est déjà utilisé. Veuillez utiliser un autre email."
          );
        } else {
          showErrorPopup(response.data.error);
        }
      } else {
        setHasAttemptedSubmit(false);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setShowSuccessPopup(true);
      }
    } catch (err) {
      showErrorPopup(
        "Une erreur s'est produite lors de l'inscription. Veuillez réessayer."
      );
    }
  };
  
  const isFieldInvalid = (fieldName: string) => {
    return hasAttemptedSubmit && invalidFields.includes(fieldName);
  };

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Popups */}
{showPopup && (
  <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/60 backdrop-blur-sm">
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md relative mx-4">
      <button
        onClick={() => setShowPopup(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition text-2xl"
      >
        ×
      </button>
      
      {/* Icon */}
      <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h3 className="text-white text-xl font-semibold mb-3">
        Inscription impossible
      </h3>
      
      <p className="text-gray-400 mb-6 whitespace-pre-line text-left text-sm leading-relaxed">
        {popupMessage}
      </p>
      
      <button
        onClick={() => setShowPopup(false)}
        className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Fermer
      </button>
    </div>
  </div>
)}

{/* Popup de succès */}
{showSuccessPopup && (
  <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/60 backdrop-blur-sm">
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md relative mx-4">
      <button
        onClick={() => setShowSuccessPopup(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition text-2xl"
      >
        ×
      </button>
      
      {/* Icon */}
      <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h3 className="text-white text-xl font-semibold mb-3">
        Inscription réussie !
      </h3>
      
      <p className="text-gray-400 mb-6 text-sm">
        Vous pouvez maintenant vous connecter.
      </p>
      
      <Link
        href="/login"
        className="inline-block w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Se connecter
      </Link>
    </div>
  </div>
)}

      <section className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="bg-gray-900 shadow-2xl rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left side - Illustration */}
              <div className="hidden lg:flex items-center justify-center p-8 lg:p-12 relative">
                <div className="relative w-full max-w-md">
                  <Image
                    src="/assets/images/element/signin.svg"
                    alt="Sign up illustration"
                    width={500}
                    height={500}
                    className="w-full h-auto"
                    priority
                  />
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-800 hidden lg:block" />
              </div>

              {/* Right side - Form */}
              <div className="p-6 sm:p-10 lg:p-14">
                <Link href="/" className="inline-block mb-6">
                  <Image
                    src="/assets/images/logo-icon.svg"
                    alt="Logo"
                    width={50}
                    height={50}
                    className="h-12 w-auto"
                  />
                </Link>

                <h1 className="text-3xl font-bold text-white mb-2">
                  Create new account
                </h1>
                <p className="text-gray-400 mb-8">
                  Already a member?{" "}
                  <Link
                    href="/login"
                    className="text-indigo-500 hover:text-indigo-400 transition"
                  >
                    Log in
                  </Link>
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Enter your name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        isFieldInvalid("name")
                          ? "border-red-500"
                          : "border-gray-700"
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition`}
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Enter email id
                    </label>
                    <input
                      type="email"
                      placeholder="user@demo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        isFieldInvalid("email")
                          ? "border-red-500"
                          : "border-gray-700"
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition`}
                    />
                    {email.length > 0 && !isValidEmail && (
                      <p className="mt-1 text-sm text-gray-400">
                        ✓ Format: exemple@exemple.tn
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Enter password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        isFieldInvalid("password")
                          ? "border-red-500"
                          : "border-gray-700"
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition`}
                    />
                    {password.length > 0 &&
                      (!hasMinLength || !hasLetters || !hasNumbers) && (
                        <div className="mt-1 text-sm space-y-1">
                          {!hasMinLength && (
                            <p className="text-gray-400">
                              ✓ Au moins 8 caractères
                            </p>
                          )}
                          {!hasLetters && (
                            <p className="text-gray-400">✓ Contient des lettres</p>
                          )}
                          {!hasNumbers && (
                            <p className="text-gray-400">✓ Contient des chiffres</p>
                          )}
                        </div>
                      )}
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••"
                      value={confirmpassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        isFieldInvalid("confirmpassword")
                          ? "border-red-500"
                          : "border-gray-700"
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition`}
                    />
                    {confirmpassword.length > 0 && !passwordsMatch && (
                      <p className="mt-1 text-sm text-gray-400">
                        ✓ Les mots de passe doivent être identiques
                      </p>
                    )}
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="keepSignedIn"
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900"
                    />
                    <label
                      htmlFor="keepSignedIn"
                      className="text-sm text-gray-400 cursor-pointer"
                    >
                      Keep me signed in
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
                  >
                    Sign up
                  </button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-900 text-gray-400">
                        Or sign up with
                      </span>
                    </div>
                  </div>

                  {/* Social Buttons */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2"
                    >
                      <FcGoogle size={20} />
                      Continue with Google
                    </button>
                    <button
                      type="button"
                      className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2"
                    >
                      <FaFacebookF size={18} className="text-blue-600" />
                      Continue with Facebook
                    </button>
                  </div>

                  {/* Copyright */}
                  <div className="text-center text-sm text-gray-500 mt-6">
                    Copyrights ©{new Date().getFullYear()} Travel Agency. Build
                    by <span className="text-gray-400">StackBros</span>.
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}