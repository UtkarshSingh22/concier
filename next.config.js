// 🔒 CORE SYSTEM - DO NOT MODIFY
// Next.js configuration for the SaaS boilerplate
// Configures image domains and other build settings

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
