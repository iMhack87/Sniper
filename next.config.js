// Next.js config
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dd.dexscreener.com',
      },
    ],
  },
}

module.exports = nextConfig
