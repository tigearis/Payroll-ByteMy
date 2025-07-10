export async function POST(req: Request) {
  try {
    const { model } = await req.json()
    const baseURL = process.env.OLLAMA_BASE_URL || "http://localhost:11434"

    const response = await fetch(`${baseURL}/api/pull`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: model }),
    })

    if (!response.ok) {
      throw new Error("Failed to pull model")
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to pull model",
    })
  }
}
