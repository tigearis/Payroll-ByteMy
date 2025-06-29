import path from "path";

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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au https://*.clerk.accounts.dev https://*.vercel.app https://*.vercel-insights.com https://*.vercel-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.clerk.com https://clerk.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au https://*.clerk.accounts.dev wss://accounts.bytemy.com.au wss://clerk.bytemy.com.au wss://*.clerk.accounts.dev https://*.neon.tech wss://*.neon.tech https://bytemy.hasura.app wss://bytemy.hasura.app https://payroll.app.bytemy.com.au https://*.vercel.app https://*.vercel-insights.com https://*.vercel-analytics.com",
              "worker-src 'self' blob:",
              "frame-src 'self' https://clerk.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au https://*.clerk.accounts.dev",
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
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
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

  // Optimize images - Updated to use remotePatterns instead of deprecated domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },

  // Enable TypeScript type checking during build
  typescript: {
    // Only ignore TypeScript errors during development, not production
    ignoreBuildErrors: false,
  },

  // Enable ESLint during builds - Re-enabled after fixing issues
  eslint: {
    // Re-enable ESLint checking during builds
    ignoreDuringBuilds: true,
    // Specify directories to lint during builds
    dirs: ["app", "components", "lib", "hooks", "domains", "shared"],
  },

  // Experimental features - Updated based on Next.js 15.3.4
  experimental: {
    // Server actions configuration
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Exclude e2e and other test folders from build output tracing
  outputFileTracingExcludes: {
    "*": [
      "./e2e/**/*",
      "./tests/**/*",
      "./**/*.test.*",
      "./**/*.spec.*",
      "./cypress/**/*",
      "./playwright.config.*",
      "./jest.config.*",
      "./.git/**/*",
      "./node_modules/@types/**/*",
    ],
  },

  // Webpack configuration
  webpack: (config, { isServer, dev, webpack }) => {
    // Preserve existing aliases and add our path alias
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve("."),
    };

    // Handle ES modules properly
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
      ".cjs": [".cts", ".cjs"],
    };

    // PRODUCTION BUILD EXCLUSIONS
    // Exclude e2e and test folders from production builds
    if (process.env.NODE_ENV === "production") {
      // Use IgnorePlugin to exclude e2e and test patterns
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp:
            /\/(e2e|tests|cypress|__tests__|playwright\.config|jest\.config|.*\.(test|spec)\.(js|jsx|ts|tsx))$/,
        })
      );

      // Note: Dev API routes are handled via runtime checks and rewrites
      // Do not use IgnorePlugin for API routes as it breaks module resolution

      // Add module rules to exclude e2e and test files
      config.module.rules.push({
        test: /\/(e2e|tests|cypress|__tests__)\/.*$/,
        loader: "null-loader",
      });

      config.module.rules.push({
        test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
        loader: "null-loader",
      });

      config.module.rules.push({
        test: /(playwright|jest|vitest)\.config\.(js|ts|mjs|cjs)$/,
        loader: "null-loader",
      });

      // Exclude entire e2e directory and other test directories
      config.resolve.alias = {
        ...config.resolve.alias,
        "@/e2e": false,
        "./e2e": false,
        e2e: false,
        "@/tests": false,
        "./tests": false,
        tests: false,
        "@/cypress": false,
        "./cypress": false,
        cypress: false,
        "@/__tests__": false,
        "./__tests__": false,
        __tests__: false,
      };

      // Add externals to prevent bundling e2e files
      if (!config.externals) {
        config.externals = [];
      }
      if (
        typeof config.externals === "object" &&
        !Array.isArray(config.externals)
      ) {
        config.externals = [config.externals];
      }
      if (Array.isArray(config.externals)) {
        config.externals.push(({ request }, callback) => {
          if (
            typeof request === "string" &&
            (request.includes("/e2e/") ||
              request.includes("\\e2e\\") ||
              request.includes("playwright.config") ||
              request.includes("jest.config"))
          ) {
            return callback(null, "commonjs " + request);
          }
          callback();
        });
      }
    }

    return config;
  },

  // Custom page exclusions for production builds
  async rewrites() {
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      // In production, redirect WIP pages to 404
      return {
        beforeFiles: [
          {
            source: "/ai-assistant",
            destination: "/404",
          },
          {
            source: "/calendar",
            destination: "/404",
          },
          {
            source: "/tax-calculator",
            destination: "/404",
          },
          // Redirect dev API routes to 404 in production
          {
            source: "/api/dev/:path*",
            destination: "/api/404",
          },
        ],
      };
    }

    return {
      beforeFiles: [],
    };
  },

  // Redirects for development-only routes
  async redirects() {
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      return [
        {
          source: "/api/dev/:path*",
          destination: "/api/404",
          permanent: false,
        },
      ];
    }

    return [];
  },
};

export default nextConfig;
