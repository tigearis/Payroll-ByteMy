import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { UpdateUserProfileDocument } from "@/domains/users/graphql/generated/graphql";

export const PUT = withAuth(
  async (req: NextRequest, _session, { params }: any) => {
    const { id } = await params;
    if (!id)
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    const body = await req.json();
    const status = body?.status;
    // optional: reason not persisted yet
    if (typeof status !== "string") {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    try {
      const { data } = await adminApolloClient.mutate({
        mutation: UpdateUserProfileDocument as any,
        variables: { id, input: { isActive: status === "active" } },
      });
      const updated = data?.updateUsersByPk;
      if (!updated)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json({ success: true, user: updated });
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message || "Failed to update status" },
        { status: 500 }
      );
    }
  }
);
