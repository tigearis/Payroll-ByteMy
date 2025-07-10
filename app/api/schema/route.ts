import { introspectSchema } from "@/lib/hasura"

export async function POST(req: Request) {
  try {
    const hasuraConfig = await req.json()

    if (!hasuraConfig.endpoint || !hasuraConfig.adminSecret) {
      return Response.json({
        success: false,
        error: "Hasura configuration is required",
      })
    }

    const schema = await introspectSchema(hasuraConfig)

    return Response.json({
      success: true,
      schema,
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Schema introspection failed",
    })
  }
}
