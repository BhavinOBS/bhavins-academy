/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // ✅ ensures /app folder is used
  },
};

module.exports = nextConfig;
