// app/api/clerk-webhooks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { syncUserWithDatabase, deleteUserFromDatabase } from "@/lib/user-sync";

export async function POST(req: NextRequest) {
  try {
    // Verify webhook (you should implement proper verification)
    const payload = await req.json() as WebhookEvent;
    
    const eventType = payload.type;
    
    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, first_name, last_name, email_addresses } = payload.data;
      
      const name = [first_name, last_name].filter(Boolean).join(' ');
      const primaryEmail = email_addresses?.find(email => email.id === payload.data.primary_email_address_id);
      
      if (id) {
        await syncUserWithDatabase(
          id, 
          name, 
          primaryEmail?.email_address ?? ""
        );
      } else {
        console.error("User ID is missing in webhook payload");
        return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
      }
      
      return NextResponse.json({ success: true });
    }
    
    if (eventType === "user.deleted") {
      const { id } = payload.data;
      
      if (id) {
        await deleteUserFromDatabase(id);
      } else {
        console.error("User ID is missing in deletion webhook payload");
        return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
      }
      
      return NextResponse.json({ success: true });
    }
    
    // Other event types
    return NextResponse.json({ success: true, message: `Unhandled event type: ${eventType}` });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}