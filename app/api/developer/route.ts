// app/api/developer/route.ts
// SECURITY: Developer routes are disabled in production
import { gql } from "@apollo/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { adminApolloClient } from "@/lib/server-apollo-client";

// SECURITY: Check if in production and return 404
const isProduction = process.env.NODE_ENV === 'production';

export async function GET() {
  // SECURITY: Block in production
  if (isProduction) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const claims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    if (claims?.["x-hasura-default-role"] !== "developer") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const GET_ALL_CLIENTS = gql`
      query GetAllClients {
        clients {
          id
          name
          contact_person
          contact_email
          active
        }
      }
    `;

    const { data } = await adminApolloClient.query({ query: GET_ALL_CLIENTS });
    return NextResponse.json({ clients: data.clients, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // SECURITY: Block in production
  if (isProduction) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  try {
    // Check authentication
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for admin role
    const token = await getToken({ template: "hasura" });
    if (token) {
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
      const role = payload["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"];
      if (role !== "developer") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { operation } = await req.json();
    
    const GET_ALL_CLIENTS = gql`
      query GetAllClients {
        clients {
          id
          name
          contact_person
          contact_email
          active
        }
      }
    `;
    
    if (operation === "get_all_clients") {
      const result = await adminApolloClient.query({ query: GET_ALL_CLIENTS });
      return NextResponse.json({ success: true, clients: result.data.clients });
    }

    return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}