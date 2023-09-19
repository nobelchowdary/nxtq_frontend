/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["nxtq.s3.us-east-2.amazonaws.com"],
    minimumCacheTTL: 120,
  },
};

module.exports = nextConfig;
