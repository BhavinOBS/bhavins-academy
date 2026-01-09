"use client";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-300 bg-gray-50 text-gray-900">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            {/* 🌟 Global Header */}
            <Header />

            {/* 🌍 Main Page Content */}
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

