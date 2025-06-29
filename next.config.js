import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build output configuration
  distDir: ".next",
  generateEtags: true,
  pageExtensions: ["tsx", "ts", "jsx", "js", "mdx"],

  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
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
          // Removed X-XSS-Protection (deprecated in favor of CSP)
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Modern security headers - adjusted for compatibility
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups", // Changed for Clerk compatibility
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au https://*.clerk.accounts.dev https://*.vercel.app https://*.vercel-insights.com https://*.vercel-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com", // Added for Geist fonts
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
                  "https://payroll.app.bytemy.com.au"
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
          {
            key: "Vary",
            value: "Origin",
          },
        ],
      },
      {
        // Cache headers for static assets
        source: "/(_next/static|favicon.ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Basic configuration
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,

  // Image optimization (Next.js 15 enhanced)
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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },

  // TypeScript configuration (Next.js 15 improvements)
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: "./tsconfig.json",
  },

  // ESLint configuration (Enhanced in Next.js 15)
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["app", "components", "lib", "hooks", "domains", "shared"],
  },

  // Compiler optimizations (Next.js 15 features)
  compiler: {
    // Remove console logs in production
    removeConsole: {
      exclude: ["error", "warn"],
    },
    // Remove React dev properties in production
    reactRemoveProperties: true,
  },

  // Experimental features (stable and tested in Next.js 15.3.4)
  experimental: {
    // Server Actions configuration (stable in Next.js 15)
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "payroll.app.bytemy.com.au",
        "*.vercel.app",
      ],
      bodySizeLimit: "2mb",
    },

    // Package optimization for better tree shaking
    optimizePackageImports: [
      "@clerk/nextjs",
      "@apollo/client",
      "lodash",
      "date-fns",
      "@headlessui/react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "lucide-react",
    ],

    // CSS optimization
    optimizeCss: false,

    // Memory optimization
    isrFlushToDisk: true,

    // Build optimizations
    webVitalsAttribution: ["CLS", "LCP", "FID", "TTFB"],
  },

  // Turbopack configuration (Much improved in Next.js 15)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
      "*.md": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
    resolveAlias: {
      "@": path.resolve("."),
      "@/components": path.resolve("./components"),
      "@/lib": path.resolve("./lib"),
      "@/hooks": path.resolve("./hooks"),
      "@/domains": path.resolve("./domains"),
      "@/shared": path.resolve("./shared"),
      "@/config": path.resolve("./config"),
      "@/types": path.resolve("./types"),
    },
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  // Build optimization - exclude test files and dev tools
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
      "./coverage/**/*",
      "./.storybook/**/*",
      "./stories/**/*",
      "./backups/**/*",
      "./_backup_delete/**/*",
    ],
  },

  // Webpack configuration with Next.js 15 improvements
  webpack: (config, { isServer, webpack }) => {
    // Path aliases (matching tsconfig.json)
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve("."),
      "@/components": path.resolve("./components"),
      "@/lib": path.resolve("./lib"),
      "@/hooks": path.resolve("./hooks"),
      "@/domains": path.resolve("./domains"),
      "@/shared": path.resolve("./shared"),
      "@/config": path.resolve("./config"),
      "@/types": path.resolve("./types"),
      "@/app": path.resolve("./app"),
      "@/utils": path.resolve("./utils"),
      "@/graphql": path.resolve("./graphql"),
      "@/scripts": path.resolve("./scripts"),
      "@/database": path.resolve("./database"),
      "@/hasura": path.resolve("./hasura"),
    };

    // Handle ES modules properly
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
      ".cjs": [".cts", ".cjs"],
    };

    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Bundle analyzer (development only)
    if (process.env.ANALYZE === "true" && !isServer) {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
          reportFilename: "../bundle-analyzer-report.html",
        })
      );
    }

    // Production optimizations
    if (process.env.NODE_ENV === "production") {
      // Exclude test files from production builds
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp:
            /\/(e2e|tests|cypress|__tests__|\.storybook|stories|playwright\.config|jest\.config|.*\.(test|spec)\.(js|jsx|ts|tsx))$/,
        })
      );

      // Use null-loader for test patterns
      config.module.rules.push(
        {
          test: /\/(e2e|tests|cypress|__tests__|\.storybook|stories)\/.*$/,
          loader: "null-loader",
        },
        {
          test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
          loader: "null-loader",
        },
        {
          test: /(playwright|jest|vitest|storybook)\.config\.(js|ts|mjs|cjs)$/,
          loader: "null-loader",
        }
      );

      // Exclude test directories via aliases
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
        "@/.storybook": false,
        "./.storybook": false,
        "@/stories": false,
        "./stories": false,
        stories: false,
        "@/backups": false,
        "./backups": false,
        "@/_backup_delete": false,
        "./_backup_delete": false,
      };

      // External exclusions
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
              request.includes("/tests/") ||
              request.includes("\\tests\\") ||
              request.includes("/__tests__/") ||
              request.includes("\\__tests__\\") ||
              request.includes("/cypress/") ||
              request.includes("\\cypress\\") ||
              request.includes("/stories/") ||
              request.includes("\\stories\\") ||
              request.includes("/.storybook/") ||
              request.includes("\\.storybook\\") ||
              request.includes("/backups/") ||
              request.includes("\\backups\\") ||
              request.includes("/_backup_delete/") ||
              request.includes("\\_backup_delete\\") ||
              request.includes("playwright.config") ||
              request.includes("jest.config") ||
              request.includes("storybook.config"))
          ) {
            return callback(null, "commonjs " + request);
          }
          callback();
        });
      }
    }

    return config;
  },

  // Custom rewrites for production/development
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
          // Redirect test/debug routes
          {
            source: "/api/test/:path*",
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
        {
          source: "/api/test/:path*",
          destination: "/api/404",
          permanent: false,
        },
        // Redirect debug routes in production
        {
          source: "/debug/:path*",
          destination: "/404",
          permanent: false,
        },
      ];
    }

    return [];
  },

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },

  // Performance configuration
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 60 seconds
    pagesBufferLength: 5, // Keep 5 pages in buffer
  },

  // Source maps for debugging (development only)
  productionBrowserSourceMaps: false,

  // Output mode
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
};

export default nextConfig;
