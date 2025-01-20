/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/:path*",
          destination: "/[...not_found]",
        },
      ],
    };
  },
};

module.exports = nextConfig;
