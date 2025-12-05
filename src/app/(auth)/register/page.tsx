"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      });

      if (result.data) {
        router.push("/");
      } else {
        setError("Failed to create account");
      }
    } catch {
      setError("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="mb-12 inline-flex items-center text-gray-400 transition-colors duration-200 hover:text-white"
        >
          <span className="mr-2 text-2xl">←</span>
          <span className="font-mono text-sm">BACK</span>
        </Link>

        {/* Title */}
        <div className="mb-12">
          <h1 className="mb-2 text-6xl font-bold tracking-tighter">CREATE</h1>
          <p className="font-mono text-sm text-gray-400">Make your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="mb-2 block font-mono text-xs text-gray-400">
              NAME
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-white bg-white px-4 py-3 font-mono text-sm text-black transition-colors focus:border-gray-300 focus:outline-none"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block font-mono text-xs text-gray-400">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-white bg-white px-4 py-3 font-mono text-sm text-black transition-colors focus:border-gray-300 focus:outline-none"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-mono text-xs text-gray-400">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-white bg-white px-4 py-3 font-mono text-sm text-black transition-colors focus:border-gray-300 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block font-mono text-xs text-gray-400">
              CONFIRM PASSWORD
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-2 border-white bg-white px-4 py-3 font-mono text-sm text-black transition-colors focus:border-gray-300 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500 px-4 py-3 font-mono text-sm text-white">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full border-2 border-white bg-white px-6 py-4 font-mono text-sm font-bold text-black transition-all duration-200 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="h-px flex-1 bg-gray-800"></div>
          <span className="px-4 font-mono text-xs text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-800"></div>
        </div>

        {/* Google Sign Up */}
        <button
          onClick={() => signIn.social({ provider: "google", callbackURL: "/" })}
          className="w-full border-2 border-gray-600 bg-transparent px-6 py-4 font-mono text-sm font-bold text-white transition-all duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
        >
          CONTINUE WITH GOOGLE
        </button>

        {/* Sign in link */}
        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="font-mono text-sm text-gray-400 transition-colors duration-200 hover:text-white"
          >
            HAVE ACCOUNT? → SIGN IN
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed top-8 right-8">
        <div className="h-16 w-16 border-2 border-gray-800"></div>
      </div>
      <div className="fixed bottom-8 left-8">
        <div className="h-8 w-8 bg-white"></div>
      </div>
    </div>
  );
}