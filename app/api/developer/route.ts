// app/api/developer/route.ts
// SECURITY: Developer routes are disabled in production
import { NextRequest, NextResponse } from "next/server";
import { 
  GetAllClientsForDeveloperDocument,
  type GetAllClientsForDeveloperQuery
} from "@/domains/clients/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

// SECURITY: Check if in production and return 404
const isProduction = process.env.NODE_ENV === "production";

export const GET = withAuth(async () => {
  // SECURITY: Block in production
  if (isProduction) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  try {
    const data = await executeTypedQuery<GetAllClientsForDeveloperQuery>(
      GetAllClientsForDeveloperDocument
    );
    return NextResponse.json({ clients: data.clients, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}, {
  allowedRoles: ["developer"]
});

export const POST = withAuth(async (req: NextRequest) => {
  // SECURITY: Block in production
  if (isProduction) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  try {
    const { operation } = await req.json();

    if (operation === "get_all_clients") {
      const data = await executeTypedQuery<GetAllClientsForDeveloperQuery>(
        GetAllClientsForDeveloperDocument
      );
      return NextResponse.json({ success: true, clients: data.clients });
    }

    return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}, {
  allowedRoles: ["developer"]
});
