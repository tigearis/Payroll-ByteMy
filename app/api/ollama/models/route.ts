export async function GET() {
  try {
    const baseURL = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
    const response = await fetch(`${baseURL}/api/tags`)

    if (!response.ok) {
      throw new Error("Failed to fetch models")
    }

    const data = await response.json()
    return Response.json({
      success: true,
      models: data.models?.map((m: any) => m.name) || [],
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch models",
    })
  }
}
