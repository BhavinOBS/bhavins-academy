"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* 🌟 Brand */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
        >
          Let's Learn IT
        </Link>

        {/* 🧭 Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <Link href="/courses" className="hover:text-blue-600 transition" onClick={closeMenu}>
            Courses
          </Link>
          <Link href="/blog" className="hover:text-blue-600 transition" onClick={closeMenu}>
            Blog
          </Link>
          <Link href="/art" className="hover:text-blue-600 transition" onClick={closeMenu}>
            Art
          </Link>
          <Link href="/admin" className="hover:text-blue-600 transition" onClick={closeMenu}>
            Admin
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition" onClick={closeMenu}>
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition" onClick={closeMenu}>
            Contact
          </Link>
        </div>

        {/* 👤 Auth Buttons + Profile */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              {/* ✅ Profile Button */}
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition"
              >
                <Image
                  src={session.user.image || "/default-avatar.png"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full border border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  {session.user.name?.split(" ")[0] || "Profile"}
                </span>
              </Link>

              {/* Sign Out Button */}
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          )}
        </div>

        {/* 🍔 Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700 hover:text-blue-600 transition"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* 📱 Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <div className="flex flex-col px-6 py-4 space-y-4 text-gray-700 font-medium">
            <Link href="/courses" onClick={closeMenu} className="hover:text-blue-600 transition">
              Courses
            </Link>
            <Link href="/blog" onClick={closeMenu} className="hover:text-blue-600 transition">
              Blog
            </Link>
            <Link href="/admin" onClick={closeMenu} className="hover:text-blue-600 transition">
              Admin
            </Link>
            <Link href="/about" onClick={closeMenu} className="hover:text-blue-600 transition">
              About
            </Link>
            <Link href="/contact" onClick={closeMenu} className="hover:text-blue-600 transition">
              Contact
            </Link>

            {session ? (
              <>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={session.user.image || "/default-avatar.png"}
                    alt="Profile"
                    width={28}
                    height={28}
                    className="rounded-full border"
                  />
                  <span>{session.user.name || "Profile"}</span>
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  signIn();
                  closeMenu();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

