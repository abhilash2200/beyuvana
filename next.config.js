/** @type {import('next').NextConfig} */
let nodeVersion = () => {
  console.log("Node version:", process.version);
}

nodeVersion();

const nextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 1 day (24 * 60 * 60 seconds)
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME || "beyuvana.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.beyuvana.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME || "beyuvana.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "*.beyuvana.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // Security headers for all routes
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
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
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://beyuvana.com/api";
    // Remove trailing slash if present to avoid double slashes
    const baseUrl = apiBaseUrl.replace(/\/$/, "");
    return [
      // Keep legacy proxy mapping.
      {
        source: "/api/proxy",
        destination: "/proxy",
      },
      // Let Next.js handle the contact API route so it can proxy to sendmail.php.
      {
        source: "/api/contact",
        destination: "/api/contact",
      },
      // Rewrite all other /api/* to backend.
      {
        source: "/api/:path*",
        destination: `${baseUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;