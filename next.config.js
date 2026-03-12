// Next.js config
const nextConfig = {
  reactStrictMode: true,
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
