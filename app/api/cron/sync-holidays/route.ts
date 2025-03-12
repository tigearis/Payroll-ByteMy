// app/api/cron/sync-holidays/route.ts
import { NextResponse } from "next/server"
import { syncAustralianHolidays } from "@/lib/holiday-sync-service"

export async function GET() {
  try {
    // Sync Australian holidays
    await syncAustralianHolidays()

    return NextResponse.json({ 
      success: true, 
      message: "Holiday sync completed successfully" 
    })
  } catch (error) {
    console.error("Cron holiday sync error:", error)
    return NextResponse.json({ 
      error: "Failed to sync holidays via cron", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}

// Note: Configure this in vercel.json to run periodically