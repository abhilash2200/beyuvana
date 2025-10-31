import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,

  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
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
        source: "/:all*(jpg|jpeg|png|gif|webp|svg|ico)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, must-revalidate",
          },
        ],
      },
      {
        source: "/:all*(mp4|mov|webm|avi|mkv)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, must-revalidate",
          },
        ],
      },
      {
        source: "/:all*(css|js)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
      {
        source: "/:all*(ttf|woff|woff2|eot)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
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
