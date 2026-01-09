/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // optional if you have a pages/ folder
  ],
  theme: {
    extend: {
      // 🎨 You can define custom colors or fonts globally here later if needed
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // 🪶 Enables the prose classes for Markdown/HTML
  ],
};

