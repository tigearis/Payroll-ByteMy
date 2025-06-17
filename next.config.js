/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
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
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'strict-dynamic' https://clerk.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.clerk.com https://clerk.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au wss://accounts.bytemy.com.au wss://clerk.bytemy.com.au https://*.neon.tech wss://*.neon.tech https://bytemy.hasura.app https://payroll.app.bytemy.com.au",
              "worker-src 'self' blob:",
              "frame-src 'self' https://clerk.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      {
        // CORS headers for API routes
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value:
              process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_APP_URL ||
                  "https://payroll.example.com"
                : "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable strict mode for React
  reactStrictMode: true,

  // Optimize images
  images: {
    domains: ["img.clerk.com", "images.clerk.dev"],
    formats: ["image/avif", "image/webp"],
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },

  // Enable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: false,
  },

  // Enable ESLint during builds
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
    disableOptimizedLoading: true,
  },

  // Webpack configuration for TypeScript path aliases
  webpack: (config, { isServer, dev }) => {
    // Add TypeScript path aliases to webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": ".",
    };

    return config;
  },

  // Custom page exclusions for production builds
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // In production, redirect WIP pages to 404
      return {
        beforeFiles: [
          {
            source: '/ai-assistant',
            destination: '/404',
          },
          {
            source: '/calendar', 
            destination: '/404',
          },
          {
            source: '/tax-calculator',
            destination: '/404',
          },
        ],
      };
    }
    
    return {
      beforeFiles: [],
    };
  },

};

export default nextConfig;
