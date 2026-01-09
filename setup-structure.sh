
#!/usr/bin/env bash

set -euo pipefail

ROOT="/home/bhavin/my-site"

echo "➡️  Setting up folder structure under: $ROOT"

# --- Create directories ---
mkdir -p "$ROOT/app"
mkdir -p "$ROOT/components/layout"
mkdir -p "$ROOT/components/ui"
mkdir -p "$ROOT/styles"
mkdir -p "$ROOT/public/images"
mkdir -p "$ROOT/lib"
mkdir -p "$ROOT/hooks"
mkdir -p "$ROOT/types"

# --- app/layout.tsx (create only if missing) ---
LAYOUT_FILE="$ROOT/app/layout.tsx"
if [ ! -f "$LAYOUT_FILE" ]; then
  cat > "$LAYOUT_FILE" <<'EOF'
// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Bhavin’s Next App",
  description: "Clean Next.js starter with TypeScript & Tailwind",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white dark:bg-black text-black dark:text-zinc-50">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
EOF
  echo "✅ Created app/layout.tsx"
else
  echo "ℹ️  app/layout.tsx already exists – skipped"
fi

# --- app/page.tsx (create minimal if missing; you already updated it) ---
PAGE_FILE="$ROOT/app/page.tsx"
if [ ! -f "$PAGE_FILE" ]; then
  cat > "$PAGE_FILE" <<'EOF'
// app/page.tsx
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-8">
      <section className="max-w-3xl w-full text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Welcome, Bhavin
        </h1>
        <p className="mt-3 text-zinc-700 dark:text-zinc-400">
          Clean Next.js + TypeScript + Tailwind starter. Build fast. Keep it maintainable.
        </p>
      </section>
    </main>
  );
}
EOF
  echo "✅ Created app/page.tsx"
else
  echo "ℹ️  app/page.tsx already exists – skipped"
fi

# --- components/layout/Header.tsx ---
HEADER_FILE="$ROOT/components/layout/Header.tsx"
if [ ! -f "$HEADER_FILE" ]; then
  cat > "$HEADER_FILE" <<'EOF'
// components/layout/Header.tsx
export function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <span className="font-bold">Bhavin</span>
        <nav className="flex gap-4 text-sm">
          /Home</a>
          /aboutAbout</a>
          /contactContact</a>
        </nav>
      </div>
    </header>
  );
}
EOF
  echo "✅ Created components/layout/Header.tsx"
else
  echo "ℹ️  components/layout/Header.tsx already exists – skipped"
fi

# --- components/layout/Footer.tsx ---
FOOTER_FILE="$ROOT/components/layout/Footer.tsx"
if [ ! -f "$FOOTER_FILE" ]; then
  cat > "$FOOTER_FILE" <<'EOF'
// components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-zinc-600 dark:text-zinc-400">
        © {new Date().getFullYear()} Bhavin Khatri · Crafted with discipline (Dharma) & clarity.
      </div>
    </footer>
  );
}
EOF
  echo "✅ Created components/layout/Footer.tsx"
else
  echo "ℹ️  components/layout/Footer.tsx already exists – skipped"
fi

# --- styles/globals.css ---
GLOBAL_CSS="$ROOT/styles/globals.css"
if [ ! -f "$GLOBAL_CSS" ]; then
  cat > "$GLOBAL_CSS" <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Design tokens */
:root {
  --brand: #0ea5e9;
}

/* Base defaults */
html, body { min-height: 100%; }
EOF
  echo "✅ Created styles/globals.css"
else
  echo "ℹ️  styles/globals.css already exists – skipped"
fi

# --- tsconfig.json (add if missing, with aliases) ---
TSCONFIG="$ROOT/tsconfig.json"
if [ ! -f "$TSCONFIG" ]; then
  cat > "$TSCONFIG" <<'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "ES2020"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/hooks/*": ["hooks/*"],
      "@/types/*": ["types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF
  echo "✅ Created tsconfig.json"
else
  echo "ℹ️  tsconfig.json already exists – skipped"
fi

# --- .eslintrc.json ---
ESLINT="$ROOT/.eslintrc.json"
if [ ! -f "$ESLINT" ]; then
  cat > "$ESLINT" <<'EOF'
{
  "root": true,
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "ignorePatterns": ["node_modules/", ".next/", "dist/"]
}
EOF
  echo "✅ Created .eslintrc.json"
else
  echo "ℹ️  .eslintrc.json already exists – skipped"
fi

echo "🎉 Structure setup complete."
echo "Next steps:"
echo "  • Ensure tailwind.config.js scans ./app, ./components, and ./styles."
echo "  • Run: npm run dev"

