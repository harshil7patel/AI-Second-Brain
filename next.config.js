/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
    serverComponentsExternalPackages: ["pdf-parse"],
  },
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}
module.exports = nextConfig
