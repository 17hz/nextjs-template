"use client";

import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";

export default function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="font-mono text-sm">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Navigation */}
      <nav className="absolute top-0 right-0 left-0 z-10 p-8">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter">APP</div>
          {session ? (
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-gray-400">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="border border-gray-600 px-4 py-2 font-mono text-sm transition-colors duration-200 hover:bg-gray-600"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                href="/login"
                className="border border-white px-4 py-2 font-mono text-sm transition-colors duration-200 hover:bg-white hover:text-black"
              >
                LOGIN
              </Link>
              <Link
                href="/register"
                className="bg-white px-4 py-2 font-mono text-sm font-bold text-black transition-colors duration-200 hover:bg-gray-200"
              >
                REGISTER
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-4xl text-center">
          {/* Main Title */}
          <h1 className="mb-8 text-7xl font-bold tracking-tighter md:text-8xl">
            {session ? (
              <span>
                WELCOME
                <br />
                BACK
              </span>
            ) : (
              <span>
                START
                <br />
                HERE
              </span>
            )}
          </h1>

          {/* Subtitle */}
          <p className="mb-12 font-mono text-xl text-gray-400 md:text-2xl">
            {session ? "You're successfully authenticated" : "Join us to continue"}
          </p>

          {/* Call to Action */}
          {session ? (
            <div className="flex justify-center gap-8">
              <div className="h-32 w-32 border-2 border-white"></div>
              <div className="h-32 w-32 bg-white"></div>
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              <Link
                href="/login"
                className="border-2 border-white px-8 py-4 font-mono text-sm transition-all duration-200 hover:bg-white hover:text-black"
              >
                SIGN IN TO CONTINUE
              </Link>
              <Link
                href="/register"
                className="bg-white px-8 py-4 font-mono text-sm font-bold text-black transition-all duration-200 hover:bg-gray-200"
              >
                CREATE NEW ACCOUNT
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-8 h-8 w-8 bg-white"></div>
      <div className="absolute top-1/4 right-8 h-16 w-16 border-2 border-gray-800"></div>
      <div className="absolute bottom-1/4 left-1/4 h-12 w-12 border-2 border-gray-600"></div>
      <div className="absolute right-1/3 bottom-1/3 h-6 w-6 bg-white"></div>
    </div>
  );
}
