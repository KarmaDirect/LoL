/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RIOT_API_KEY: process.env.RIOT_API_KEY,
    RIOT_REGION: process.env.RIOT_REGION,
    RIOT_CONTINENT: process.env.RIOT_CONTINENT,
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

module.exports = nextConfig 