import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'laikaa.in',
        port: '',
        pathname: '/backend/assets/productimages/**',
      },
      {
        protocol: 'https',
        hostname: 'beyuvana.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://beyuvana.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
