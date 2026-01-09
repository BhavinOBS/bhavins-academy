
"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-800/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        /
          Bhavin&apos;s Academy
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          /coursesCourses</Link>
          /aboutAbout</Link>
          <LinkactContact</Link>
        </nav>
      </div>
    </header>
  );
}

