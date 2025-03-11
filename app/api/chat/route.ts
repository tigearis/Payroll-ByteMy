import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4-turbo"),
    system: `You are an AI assistant for a payroll management system called Payroll Matrix. 
        You can provide information about the system's features, help with calculations, and generate 
        simple charts and tables when requested. To create a chart or table, output the data in JSON 
        format wrapped in \`\`\`chart or \`\`\`table code blocks.`,
    messages,
  })

  return result.toDataStreamResponse()
}

