// app/api/payrolls/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerApolloClient } from "@/lib/apollo-client"
import { GET_PAYROLL_BY_ID } from "@/graphql/queries/payrolls/getPayrollById"
import { auth } from "@clerk/nextjs/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) return NextResponse.json({ error: "Missing ID" }, { status: 400 })

    // Get Clerk authentication token
    const authInstance = await auth()
    const token = await authInstance.getToken({ template: "hasura" })

    // Get Apollo Client
    const client = await getServerApolloClient()

    const { data } = await client.query({
      query: GET_PAYROLL_BY_ID,
      variables: { id: params.id },
      context: { headers: { authorization: `Bearer ${token}` } },
    })

    if (!data.payrolls.length) return NextResponse.json({ error: "Not Found" }, { status: 404 })

    return NextResponse.json(data.payrolls[0])
  } catch (error) {
    console.error("Payroll fetch error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}