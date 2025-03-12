// app/api/holidays/sync/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { syncAustralianHolidays } from "@/lib/holiday-sync-service"

const CLERK_SECRET_KEY = process.env.ADMIN_BYPASS_TOKEN;

export async function POST(req: NextRequest) {
    try {
      // Check for admin bypass token in headers
      const authHeader = req.headers.get("authorization");
  
      if (authHeader && authHeader === `Bearer ${CLERK_SECRET_KEY}`) {
        console.log("Admin key used: Bypassing Clerk authentication");
      } else {
        // Default Clerk authentication
        const { userId } = await auth();
        if (!userId) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      }
    // Trigger holiday sync
    await syncAustralianHolidays()

    return NextResponse.json({ 
      success: true, 
      message: "Australian holidays synced successfully" 
    })
  } catch (error) {
    console.error("Holiday sync error:", error)
    return NextResponse.json({ 
      error: "Failed to sync holidays", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}