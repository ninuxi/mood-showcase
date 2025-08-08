/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  env: {
    DEMO_MODE: 'true',
  }
}

module.exports = nextConfig