import { createOllama } from "ollama-ai-provider"

// Create Ollama provider with default configuration
export const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434", // Default Ollama URL
})

// Available models - you can customize this based on your Ollama setup
export const AVAILABLE_MODELS = [
  "llama3.1:8b",
  "llama3.1:70b",
  "llama2:7b",
  "llama2:13b",
  "codellama:7b",
  "codellama:13b",
  "mistral:7b",
  "mixtral:8x7b",
  "phi3:mini",
  "phi3:medium",
] as const

export type OllamaModel = (typeof AVAILABLE_MODELS)[number]

// Helper function to check if a model is available
export async function checkModelAvailability(model: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.OLLAMA_BASE_URL || "http://localhost:11434"}/api/tags`)
    const data = await response.json()
    return data.models?.some((m: any) => m.name === model) || false
  } catch (error) {
    console.error("Error checking model availability:", error)
    return false
  }
}

// Helper function to pull a model if it's not available
export async function pullModel(model: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.OLLAMA_BASE_URL || "http://localhost:11434"}/api/pull`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: model }),
    })
    return response.ok
  } catch (error) {
    console.error("Error pulling model:", error)
    return false
  }
}
