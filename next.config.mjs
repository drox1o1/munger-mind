/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ALPHAVANTAGE_KEY: process.env.ALPHAVANTAGE_KEY,
    GEMINI_KEY: process.env.GEMINI_KEY,
  },
};

export default nextConfig; 