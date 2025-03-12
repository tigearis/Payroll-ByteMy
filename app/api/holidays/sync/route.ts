// app/api/holidays/sync/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkHasuraRole } from "@/utils/auth";
import { syncAustralianHolidays } from "@/lib/holiday-sync-service";

export async function POST(req: NextRequest) {
  try {
    // Admin Bypass Token
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader === `Bearer ${process.env.ADMIN_BYPASS_TOKEN}`) {
      console.log("Admin key used: Bypassing Clerk authentication");
    } else {
      // Check Hasura Role
      const isAuthorized = await checkHasuraRole(["admin", "org_admin"]);
      if (!isAuthorized) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Sync holidays
    await syncAustralianHolidays();
    return NextResponse.json({ message: "Holidays synced successfully" });
  } catch (error) {
    console.error("Error syncing holidays:", error);
    return NextResponse.json({ error: "Failed to sync holidays" }, { status: 500 });
  }
}
