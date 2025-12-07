"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { User } from "lucide-react";

function SiteHeader() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/50 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-black">Cursor</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#" className="text-sm font-medium text-gray-500 transition-colors hover:text-black">
              Pricing
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-500 transition-colors hover:text-black">
              Enterprise
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-500 transition-colors hover:text-black">
              Blog
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-500 transition-colors hover:text-black">
              Changelog
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <Link href="/dashboard">
              <Button variant="ghost" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-3 w-3" />
                </div>
                {session.user.name || "Dashboard"}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/signin" className="text-sm font-medium text-gray-500 transition-colors hover:text-black">
                Sign In
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="h-8 border-black/10 bg-black text-white hover:bg-black/90 hover:text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white pt-16">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -ml-[50%] h-[500px] w-[1000px] rounded-full bg-blue-100/50 blur-[100px]" />
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-100/50 blur-[120px]" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="mx-auto max-w-4xl bg-gradient-to-b from-black to-gray-600 bg-clip-text text-5xl font-bold tracking-tighter text-transparent sm:text-7xl lg:text-8xl">
          The AI-first Code Editor
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 sm:text-xl">
          Built to make you extraordinarily productive. Cursor is the best way to code with AI.
        </p>
        
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="h-12 rounded-full bg-black px-8 text-sm font-medium text-white shadow-xl shadow-black/5 transition-transform hover:scale-105 hover:shadow-2xl hover:shadow-black/10">
            Download for Mac
          </button>
          <button className="h-12 rounded-full border border-black/10 bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-gray-50">
            Read Manifest
          </button>
        </div>

        {/* Visual Element Placeholder */}
        <div className="mt-20 w-full">
          <div className="mx-auto h-[400px] w-full max-w-5xl rounded-t-xl border border-black/5 bg-white shadow-2xl shadow-black/5 lg:h-[600px]">
            <div className="flex items-center gap-2 rounded-t-xl border-b border-black/5 bg-gray-50/50 p-4">
              <div className="h-3 w-3 rounded-full bg-red-400/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <div className="h-3 w-3 rounded-full bg-green-400/80" />
            </div>
            <div className="p-8 text-left font-mono text-sm">
              <span className="text-blue-600">const</span> <span className="text-yellow-600">future</span> = <span className="text-purple-600">await</span> <span className="text-blue-500">buildWithAI</span>();
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-black/5">
      <SiteHeader />
      <main>
        <HeroSection />
      </main>
      
      {/* Simple Footer */}
      <footer className="border-t border-black/5 bg-white py-8 text-center text-sm text-gray-400">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} AI Editor. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
