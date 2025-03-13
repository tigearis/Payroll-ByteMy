import { NextRequest, NextResponse } from "next/server";
import adminApolloClient from "@/lib/apollo-admin";
import { GET_PAYROLLS } from "@/graphql/queries/payrolls/getPayrolls";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { getToken } = auth();
  const token = await getToken({ template: "hasura" });

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { data } = await adminApolloClient.query({
      query: GET_PAYROLLS,
      context: { headers: { authorization: `Bearer ${token}` } },
    });

    return NextResponse.json({ payrolls: data.payrolls });
  } catch (error) {
    console.error("Payroll Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch payrolls" }, { status: 500 });
  }
}
