/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'upload.wikimedia.org',
      'flagcdn.com',
      'flagsapi.com',
      'img.fifa.com'
    ],
  },
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
}

module.exports = nextConfig