/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL_NAME: process.env.GEMINI_MODEL_NAME,
  },
}

module.exports = nextConfig
