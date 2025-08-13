import { createHash } from "crypto";
import { gql } from "@apollo/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Import real service implementations
import { QueryAuditService } from "@/domains/reports/services/query-audit.service";
import { QueryCacheService } from "@/domains/reports/services/query-cache.service";
import { RateLimiterService } from "@/domains/reports/services/rate-limiter.service";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { withAuth, AuthSession } from "@/lib/auth/api-auth";

// Services will be implemented in their own files

const auditService = new QueryAuditService();
const cacheService = new QueryCacheService();
const rateLimiter = new RateLimiterService();

// Input validation schema
const ExecuteCustomQuerySchema = z.object({
  query: z.string().min(1, "Query is required"),
  variables: z.record(z.any()).optional().default({}),
  options: z
    .object({
      timeout: z.number().optional().default(30000),
      maxRows: z.number().optional().default(1000),
      allowCached: z.boolean().optional().default(true),
      cache: z.boolean().optional().default(false),
      cacheTTL: z.number().optional().default(3600),
    })
    .optional()
    .default({}),
});

export const POST = withAuth(async (req: NextRequest, session: AuthSession) => {
  const { userId } = session;
  try {
    // Parse and validate the request body
    const body = await req.json();
    const input = ExecuteCustomQuerySchema.safeParse(body.input);

    if (!input.success) {
      return NextResponse.json(
        { error: "Invalid input", details: input.error.format() },
        { status: 400 }
      );
    }

    const { query, variables, options } = input.data;

    // Check rate limits
    // Pull role from Clerk session claims (falls back to viewer)
    const userRole = (session.sessionClaims as any)?.metadata?.role || "viewer";
    const canProceed = await rateLimiter.checkRateLimit(userId, userRole);

    if (!canProceed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Generate a cache key for the query
    const queryHash = createHash("sha256")
      .update(`${query}${JSON.stringify(variables)}`)
      .digest("hex");

    // Check cache if allowed
    if (options.allowCached) {
      const cachedResult = await cacheService.get(queryHash);
      if (cachedResult) {
        // Log the cache hit to audit
        await auditService.createExecutionAudit(
          userId,
          query,
          variables,
          "GraphQL",
          "success",
          cachedResult.data.length,
          0,
          true
        );

        return NextResponse.json({
          data: cachedResult.data,
          metadata: cachedResult.metadata,
          executionTime: 0,
          fromCache: true,
        });
      }
    }

    // Execute the query
    const startTime = Date.now();

    try {
      // Use the admin Apollo client to execute the query
      const result = await adminApolloClient.query({
        query: gql`
          ${query}
        `,
        variables,
        context: {
          headers: {
            "x-hasura-role": userRole,
            "x-hasura-user-id": userId,
          },
        },
        fetchPolicy: "no-cache",
      });

      const executionTime = Date.now() - startTime;

      // Extract metadata about the results
      const resultData = result.data;
      const firstKey = Object.keys(resultData)[0];
      const firstResult = resultData[firstKey];

      let totalRows = 0;
      let hasMoreRows = false;

      if (Array.isArray(firstResult)) {
        totalRows = firstResult.length;
        hasMoreRows = totalRows >= options.maxRows;
      }

      // Generate column metadata
      const columns = [];
      if (Array.isArray(firstResult) && firstResult.length > 0) {
        const sampleRow = firstResult[0];
        for (const key in sampleRow) {
          columns.push({
            name: key,
            type: typeof sampleRow[key],
          });
        }
      }

      const metadata = {
        columns,
        totalRows,
        hasMoreRows,
      };

      // Cache the result if requested
      if (options.cache) {
        await cacheService.set(
          queryHash,
          { data: resultData, metadata },
          options.cacheTTL
        );
      }

      // Log the execution to audit
      await auditService.createExecutionAudit(
        userId,
        query,
        variables,
        "GraphQL",
        "success",
        totalRows,
        executionTime,
        false
      );

      return NextResponse.json({
        data: resultData,
        metadata,
        executionTime,
        fromCache: false,
      });
    } catch (error) {
      const executionTime = Date.now() - startTime;

      // Log the error to audit
      await auditService.createExecutionAudit(
        userId,
        query,
        variables,
        "GraphQL",
        "error",
        0,
        executionTime,
        false,
        error instanceof Error ? error.message : "Unknown error"
      );

      return NextResponse.json(
        {
          error: "Query execution failed",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in execute-custom-query:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
});
