import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true, // enable gzip compression for responses

  images: {
    formats: ["image/avif", "image/webp"], // auto optimized formats
    minimumCacheTTL: 31536000, // 1 year cache for images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "beyuvana.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // Cache static assets (images, css, js, fonts, etc.)
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|ttf|woff|woff2|js|css)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year browser cache
          },
        ],
      },
      {
        // Optional: cache API responses lightly
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, s-maxage=120, stale-while-revalidate",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://beyuvana.com/api/:path*", // Proxying API
      },
    ];
  },
};

export default nextConfig;
