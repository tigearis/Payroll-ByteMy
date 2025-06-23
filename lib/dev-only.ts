import { NextResponse } from "next/server";

/**
 * Restricts API routes to development environment only
 * Returns 404 in production
 * 
 * @future-enhancement Currently unused but valuable for protecting dev-only endpoints
 * @usage Example: Use in API routes that should only be available during development
 * @example
 * ```typescript
 * export async function GET() {
 *   const { isDev, response } = restrictToDevOnly();
 *   if (!isDev) return response;
 *   // Development-only logic here
 * }
 * ```
 */
export function restrictToDevOnly() {
  if (process.env.NODE_ENV === "production") {
    const notFoundResponse = NextResponse.json(
      { error: "Not Found" },
      { status: 404 }
    );
    return {
      isDev: false,
      response: notFoundResponse,
      GET: async () => notFoundResponse,
      POST: async () => notFoundResponse,
      PUT: async () => notFoundResponse,
      PATCH: async () => notFoundResponse,
      DELETE: async () => notFoundResponse,
    };
  }
  return {
    isDev: true,
    response: null,
  };
}
