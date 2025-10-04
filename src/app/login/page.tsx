"use client";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import TextFormInput from "@/components/form/TextFormInput";
import PasswordFormInput from "@/components/form/PasswordFormInput";
import useSignIn from "@/hooks/useSignIn";

export default function Login() {
  const { control, loading, login } = useSignIn();

  return (
    <main className="min-h-screen bg-gray-950">
      <section className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="bg-gray-900 shadow-2xl rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left side - Illustration */}
              <div className="hidden lg:flex items-center justify-center p-8 lg:p-12 relative">
                <div className="relative w-full max-w-md">
                  <Image
                    src="/assets/images/element/signin.svg"
                    alt="Sign in illustration"
                    width={500}
                    height={500}
                    className="w-full h-auto"
                    priority
                  />
                </div>
                {/* Vertical divider */}
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-800 hidden lg:block" />
              </div>

              {/* Right side - Form */}
              <div className="p-6 sm:p-10 lg:p-14">
                {/* Logo */}
                <Link href="/" className="inline-block mb-6">
                  <Image
                    src="/assets/images/logo-icon.svg"
                    alt="Logo"
                    width={50}
                    height={50}
                    className="h-12 w-auto"
                  />
                </Link>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back
                </h1>
                <p className="text-gray-400 mb-8">
                  New here?{" "}
                  <Link
                    href="/register"
                    className="text-indigo-500 hover:text-indigo-400 transition"
                  >
                    Create an account
                  </Link>
                </p>

                {/* Form */}
                <form onSubmit={login} className="space-y-4">
                  <TextFormInput
                    name="email"
                    control={control}
                    label="Enter email id"
                    type="email"
                    placeholder="user@demo.com"
                  />

                  <PasswordFormInput
                    name="password"
                    control={control}
                    label="Enter password"
                  />

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900"
                      />
                      <span>Remember me?</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-indigo-500 hover:text-indigo-400 transition"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-900 text-gray-400">
                        Or sign in with
                      </span>
                    </div>
                  </div>

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

                  <div className="text-center text-sm text-gray-500 mt-6">
                    Copyrights ©{new Date().getFullYear()} Travel Agency. Build
                    by <span className="text-gray-400">Your Team</span>.
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