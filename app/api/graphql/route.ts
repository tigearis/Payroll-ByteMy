// app/api/graphql/route.ts
import type { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import apolloServer from "@/lib/apollo-server"

const handler = apolloServer

export async function GET(request: NextRequest) {
  return handler(request)
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }
  
  return handler(request)
}