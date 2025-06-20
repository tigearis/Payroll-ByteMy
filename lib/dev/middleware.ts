import { NextResponse } from "next/server";

/**
 * Restricts API routes to development environment only
 * Returns 404 in production
 */
export function restrictToDevOnly() {
  if (process.env.NODE_ENV === 'production') {
    const notFoundResponse = NextResponse.json({ error: "Not Found" }, { status: 404 });
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