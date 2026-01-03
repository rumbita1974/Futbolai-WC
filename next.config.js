/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove or comment out output: 'export' for Cloudflare Pages
  // output: 'export',
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable strict mode if causing issues
  reactStrictMode: false,
}

module.exports = nextConfig