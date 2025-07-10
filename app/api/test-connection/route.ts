import { introspectSchema } from "@/lib/hasura"

export async function POST(req: Request) {
  try {
    const { endpoint, adminSecret, role } = await req.json()

    if (!endpoint || !adminSecret) {
      return Response.json({
        success: false,
        error: "Endpoint and admin secret are required",
      })
    }

    // Test connection by performing a simple introspection
    await introspectSchema({ endpoint, adminSecret, role })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Connection test failed",
    })
  }
}
