import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au https://*.clerk.accounts.dev https://*.vercel.app https://*.vercel-insights.com https://*.vercel-analytics.com https://challenges.cloudflare.com https://*.cloudflare.com https://js.monitor.azure.com https://api.stripe.com https://maps.googleapis.com https://cdn.jsdelivr.net",
              "script-src-elem 'self' 'unsafe-inline' https://clerk.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au https://*.clerk.accounts.dev https://*.vercel.app https://*.vercel-insights.com https://*.vercel-analytics.com https://challenges.cloudflare.com https://*.cloudflare.com https://api.stripe.com https://maps.googleapis.com https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              // Allow local development Hasura endpoints (HTTP and WebSocket)
              "connect-src 'self' https://api.clerk.com https://clerk.com https://clerk-telemetry.com https://*.clerk-telemetry.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au https://*.clerk.accounts.dev wss://accounts.bytemy.com.au wss://clerk.bytemy.com.au wss://*.clerk.accounts.dev https://*.neon.tech wss://*.neon.tech https://bytemy.hasura.app wss://bytemy.hasura.app https://hasura.bytemy.com.au wss://hasura.bytemy.com.au https://payroll.bytemy.com.au https://*.vercel.app https://*.vercel-insights.com https://*.vercel-analytics.com https://challenges.cloudflare.com https://*.cloudflare.com https://api.stripe.com https://maps.googleapis.com http://localhost:8081 ws://localhost:8081 http://127.0.0.1:8081 ws://127.0.0.1:8081 http://192.168.1.229:8081 ws://192.168.1.229:8081",
              "worker-src 'self' blob:",
              "frame-src 'self' https://clerk.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au https://*.clerk.accounts.dev https://challenges.cloudflare.com https://*.cloudflare.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              // Only upgrade insecure requests in production; allow http in dev for local Hasura
              ...(process.env.NODE_ENV === "production"
                ? ["upgrade-insecure-requests"]
                : []),
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
                ? (
                    process.env.NEXT_PUBLIC_APP_URL ||
                    "https://payroll.bytemy.com.au"
                  ).trim()
                : "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Private-Network",
            value: "true",
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

  // Disabled modularizeImports for lucide-react to allow barrel exports
  // modularizeImports: {
  //   "lucide-react": {
  //     transform: "lucide-react/dist/esm/icons/{{member}}",
  //     preventFullImport: true,
  //   },
  // },

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

  // SWC Compiler optimizations (Next.js 15 features)
  compiler: {
    // Remove console logs in production
    removeConsole: {
      exclude: ["error", "warn"],
    },
    // Remove React dev properties in production
    reactRemoveProperties: true,
    // Enable SWC minification (faster than Terser)
    styledComponents: true,
  },

  // Experimental features (stable and tested in Next.js 15.3.4)
  experimental: {
    // Server Actions configuration (stable in Next.js 15)
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "127.0.0.1:3000",
        "payroll.bytemy.com.au",
        "*.vercel.app",
        // local Hasura hosts for dev proxy callbacks
        "localhost:8081",
        "127.0.0.1:8081",
        "192.168.1.229:8081",
      ],
      bodySizeLimit: "2mb",
    },

    // Enhanced package optimization for better tree shaking and module splitting
    optimizePackageImports: [
      "@clerk/nextjs",
      "@apollo/client",
      "date-fns",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],

    // CSS optimization (disabled due to critters compatibility issues)
    // optimizeCss: true,

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
      // Test directories and files
      "./e2e/**/*",
      "./tests/**/*",
      "./**/*.test.*",
      "./**/*.spec.*",
      "./cypress/**/*",
      "./playwright.config.*",
      "./playwright-minimal.config.*",
      "./jest.config.*",
      "./jest.*.config.*",
      "./__tests__/**/*",
      "./test-isolated/**/*",
      "./test-results/**/*",
      "./playwright/**/*",
      "./playwright-report/**/*",
      "./jest-html-reporters-attach/**/*",
      "./coverage/**/*",
      "./.storybook/**/*",
      "./stories/**/*",

      // Documentation and reports
      "./docs/**/*",
      "./Screenshots/**/*",
      "./APP_AUDIT/**/*",
      "./audit-reports/**/*",
      "./**/*.md",

      // Legacy and backup files
      "./backups/**/*",
      "./_backup_delete/**/*",
      "./hasura_v3/**/*",
      "./create-test-user-simple.js",
      "./demo-*.mjs",
      "./test-*.js",
      "./test-*.mjs",
      "./test-*.cjs",
      "./test-*.ts",
      "./validate-*.mjs",
      "./**/*-backup.*",
      "./**/*-old.*",
      "./**/*-legacy.*",
      "./**/*.backup",
      "./**/*.old",

      // Scripts (most not needed in production)
      "./scripts/**/*.js",
      "./scripts/**/*.mjs",
      "./scripts/**/*.cjs",
      "./scripts/lint-fixes/**/*",
      "./scripts/tests/**/*",

      // Database and Hasura files
      "./database/**/*",
      "./hasura/**/*",
      "./schema.sql",
      "./**/*.sql",

      // Development artifacts
      "./dev-startup.log",
      "./tsconfig.tsbuildinfo",
      "./audit-report.json",
      "./graphql-audit-report.json",
      "./graphql-test-report.html",
      "./pnpm-lock.yaml",
      "./work-schedule-implmentation.md",

      // IDE and system files
      "./.git/**/*",
      "./node_modules/@types/**/*",
      "./*.code-workspace",
      "./.cursorrules",
      "./.github/**/*",

      // Binary and media files
      "./**/*.xlsm",
      "./**/*.xlsx",
      "./**/*.pdf",
      "./**/*.png",
      "./**/*.jpg",
      "./**/*.webm",

      // Temporary files
      "./middleware-disabled.ts",
      "./**/*.temp",
      "./**/*.tmp",
      "./**/*.disabled",
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

    // Enhanced bundle analyzer with performance optimizations
    if (process.env.ANALYZE === "true" && !isServer) {
      try {
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: "../bundle-analyzer-report.html",
            generateStatsFile: true,
            statsFilename: "../bundle-stats.json",
          })
        );
      } catch (error) {
        console.warn("webpack-bundle-analyzer not available:", error.message);
      }
    }

    // Performance optimizations for module compilation
    if (!isServer) {
      // Enable persistent caching for faster rebuilds
      config.cache = {
        type: "filesystem",
        cacheDirectory: path.resolve(__dirname, ".next/cache/webpack"),
        buildDependencies: {
          config: [__filename],
        },
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      };

      // Advanced code splitting for optimal module loading
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            // React core (highest priority - most stable)
            reactVendor: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: "react-vendor",
              priority: 40,
              reuseExistingChunk: true,
            },
            // Apollo Client and GraphQL (separate chunk - heavy)
            apolloVendor: {
              test: /[\\/]node_modules[\\/](@apollo|@graphql-typed-document-node|graphql)[\\/]/,
              name: "apollo-vendor",
              priority: 35,
              reuseExistingChunk: true,
            },
            // Radix UI components (separate chunk - UI heavy)
            radixVendor: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: "radix-vendor",
              priority: 30,
              reuseExistingChunk: true,
            },
            // Chart libraries (lazy loaded - separate chunk)
            chartsVendor: {
              test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/,
              name: "charts-vendor",
              priority: 25,
              reuseExistingChunk: true,
            },
            // Icons (optimized separately)
            iconsVendor: {
              test: /[\\/]node_modules[\\/](lucide-react|@radix-ui\/react-icons)[\\/]/,
              name: "icons-vendor",
              priority: 20,
              reuseExistingChunk: true,
            },
            // Other stable vendor dependencies
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              priority: 10,
              reuseExistingChunk: true,
              chunks: "initial",
            },
            // GraphQL generated types (separate chunk - large)
            graphqlTypes: {
              test: /[\\/](domains|shared)[\\/].*[\\/]generated[\\/]/,
              name: "graphql-types",
              priority: 18,
              reuseExistingChunk: true,
            },
            // Domain-specific chunks (dynamic naming)
            domainPayrolls: {
              test: /[\\/]domains[\\/]payrolls[\\/]/,
              name: "domain-payrolls",
              priority: 8,
              reuseExistingChunk: true,
            },
            domainBilling: {
              test: /[\\/]domains[\\/]billing[\\/]/,
              name: "domain-billing",
              priority: 8,
              reuseExistingChunk: true,
            },
            domainClients: {
              test: /[\\/]domains[\\/]clients[\\/]/,
              name: "domain-clients",
              priority: 8,
              reuseExistingChunk: true,
            },
            domainUsers: {
              test: /[\\/]domains[\\/]users[\\/]/,
              name: "domain-users",
              priority: 8,
              reuseExistingChunk: true,
            },
            // Common domain utilities
            domainCommon: {
              test: /[\\/]domains[\\/]/,
              name: "domain-common",
              priority: 5,
              reuseExistingChunk: true,
            },
            // Shared utilities and components
            shared: {
              test: /[\\/](shared|lib|components)[\\/]/,
              name: "shared-utils",
              priority: 7,
              reuseExistingChunk: true,
              minChunks: 2, // Only if used by multiple modules
            },
            // Default fallback
            default: {
              minChunks: 2,
              priority: -10,
              reuseExistingChunk: true,
              name: "common",
            },
          },
        },
      };
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
