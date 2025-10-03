"use client";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  //controlde de saisie
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
  
  //pop up d'erreur
  const showErrorPopup = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000);
  };
  
  //valider le formulaire
  const validateForm = () => {
    const errors: string[] = [];
    let errorMessage = "Veuillez vérifier les points suivantes :\n\n";

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
    setSuccess("");
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
        setSuccess("Utilisateur enregistré avec succès!");
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
    <div>
      {/* Popup d'erreur */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-4 text-gray-600 text-2xl hover:text-gray-800"
            >
              ×
            </button>
            <h3 className="text-red-500 text-xl font-semibold mb-5">
              Inscription impossible ?
            </h3>
            <p className="text-gray-700 mb-6 whitespace-pre-line text-left">
              {popupMessage}
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-md transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Popup de succès */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <h3 className="text-green-500 text-xl font-semibold mb-5">
              Inscription réussie !
            </h3>
            <p className="text-gray-700 mb-6">
              Vous pouvez maintenant vous connecter.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <h2 className="text-center mb-8">Inscription</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 rounded border ${
              isFieldInvalid("name") ? "border-red-500 border-2" : "border-gray-300"
            } transition-colors`}
            onInvalid={(e) => e.preventDefault()}
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 rounded border ${
              isFieldInvalid("email") ? "border-red-500 border-2" : "border-gray-300"
            } transition-colors`}
            onInvalid={(e) => e.preventDefault()}
          />
        </div>
        
        {email.length > 0 && !isValidEmail && (
          <div className="mb-4 text-sm">
            <div className="text-gray-600 mb-1 transition-colors">
              ✓ exemple@exemple.tn
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 rounded border ${
              isFieldInvalid("password") ? "border-red-500 border-2" : "border-gray-300"
            } transition-colors`}
          />
        </div>
        
        {password.length > 0 && (!hasMinLength || !hasLetters || !hasNumbers) && (
          <div className="mb-4 text-sm">
            {!hasMinLength && (
              <div className="text-gray-600 mb-1 transition-colors">
                ✓ Au moins 8 caractères
              </div>
            )}
            {!hasLetters && (
              <div className="text-gray-600 mb-1 transition-colors">
                ✓ Contient des lettres
              </div>
            )}
            {!hasNumbers && (
              <div className="text-gray-600 mb-1 transition-colors">
                ✓ Contient des chiffres
              </div>
            )}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block mb-2">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full p-2 rounded border ${
              isFieldInvalid("confirmpassword") ? "border-red-500 border-2" : "border-gray-300"
            } transition-colors`}
          />
        </div>
        
        {confirmpassword.length > 0 && !passwordsMatch && (
          <div className="text-gray-600 text-sm mt-1 mb-4">
            ✓ Les mots de passe doivent être identiques
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors"
        >
          Register
        </button>
      </form>
      
      <p className="mt-4">
        Vous avez déjà un compte ? <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </div>
  );
}