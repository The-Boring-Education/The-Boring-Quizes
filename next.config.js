/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  env: {
    NEXT_PUBLIC_TBE_WEBAPP_API_URL: process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL || 'http://localhost:3000',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    NEXT_PUBLIC_ONBOARDING_APP_URL: process.env.NEXT_PUBLIC_ONBOARDING_APP_URL || 'https://onboard.theboringeducation.com',
  },
}

module.exports = nextConfig