import { streamText } from "ai"
import { executeHasuraQuery, introspectSchema } from "@/lib/hasura"
import { createOllama } from "ollama-ai-provider"
import { z } from "zod"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, hasuraConfig, ollamaConfig } = await req.json()

  if (!hasuraConfig) {
    return new Response("Hasura configuration required", { status: 400 })
  }

  if (!ollamaConfig) {
    return new Response("Ollama configuration required", { status: 400 })
  }

  // Create ollama provider instance
  const ollamaInstance = createOllama({
    baseURL: ollamaConfig.baseURL,
  })

  const result = streamText({
    model: ollamaInstance(ollamaConfig.model) as any,
    messages,
    system: `You are a Hasura Dynamic Query AI Assistant. Your role is to help users query their database using natural language by generating and executing GraphQL queries.

CORE CAPABILITIES:
1. Schema Introspection: Understand the database structure
2. Dynamic Query Generation: Create GraphQL queries based on user intent
3. Query Execution: Run queries against Hasura and format results
4. Intelligent Response: Present data in user-friendly formats

RESPONSE FORMAT:
Always respond with a JSON object containing:
{
  "summary": "Brief explanation of what you found",
  "query": "The GraphQL query you generated",
  "data": [actual query results],
  "insights": ["Key insights from the data"]
}

GUIDELINES:
- Always introspect the schema first to understand available tables and relationships
- Generate efficient GraphQL queries based on user intent
- Present results in a clear, user-friendly format
- Provide insights and context about the data
- Handle errors gracefully with helpful messages
- Never expose technical details unless specifically requested

EXAMPLE INTERACTIONS:
User: "Show me all users"
Response: Generate a query like "query { users { id name email created_at } }" and format results nicely

User: "How many orders were placed today?"
Response: Generate aggregation query with date filtering and provide count with context

User: "Top selling products this month"
Response: Generate query with joins, aggregations, and date filtering, then rank results

Remember: Focus on providing direct answers to user questions, not showing technical query details unless requested.`,
    tools: {
      introspectSchema: {
        description: "Introspect the Hasura GraphQL schema to understand available tables, columns, and relationships",
        inputSchema: z.object({}),
        execute: async () => {
          try {
            const schema = await introspectSchema(hasuraConfig)
            return { success: true, schema }
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : "Schema introspection failed" }
          }
        },
      },
      executeQuery: {
        description: "Execute a GraphQL query against the Hasura instance",
        inputSchema: z.object({
          query: z.string().describe("The GraphQL query to execute"),
          variables: z.object({}).optional().describe("Variables for the GraphQL query"),
        }),
        execute: async ({ query, variables = {} }) => {
          try {
            const result = await executeHasuraQuery(hasuraConfig, query, variables)
            return { success: true, data: result }
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : "Query execution failed" }
          }
        },
      },
    },
  })

  return result.toTextStreamResponse()
}
