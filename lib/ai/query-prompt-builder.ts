/**
 * Query Prompt Builder for AI Assistant
 * 
 * Builds prompts for GraphQL query generation without template syntax conflicts
 */

export function buildQueryGenerationPrompt(
  userRole: string,
  currentPage: string,
  availableSchema: string
): string {
  return `User Role: ${userRole}
Current Page: ${currentPage}

Available GraphQL Schema and Business Context:
${availableSchema}

TASK: Generate a comprehensive GraphQL query based on the user's request that will provide maximum business value and insights.

RESPONSE FORMAT - You MUST respond with valid JSON containing:
- query: A comprehensive GraphQL query string with proper syntax
- explanation: A business-focused explanation of what insights the query provides
- variables: Any variables needed (optional)

QUERY GENERATION STRATEGY:
1. **Understand Business Intent**: What business question is the user really asking?
2. **Select Comprehensive Fields**: Include all relevant fields that provide business context
3. **Include Relationships**: Fetch related data that adds business value
4. **Apply Smart Filtering**: Use appropriate filters to get the most relevant data
5. **Optimize for Insights**: Structure the query to enable meaningful analysis

QUERY EXCELLENCE CRITERIA:
✅ Include essential business fields (names, dates, statuses, amounts)
✅ Fetch meaningful relationships (client details for payrolls, user info for assignments)
✅ Use appropriate filtering (active records, recent dates, relevant statuses)
✅ Add sorting for consistent, logical results
✅ Include reasonable limits for performance
✅ Select fields that enable business analysis and decision-making

EXPLANATION EXCELLENCE CRITERIA:
✅ Explain the business value and insights the query provides
✅ Highlight key data points and their business significance
✅ Mention potential use cases for the data
✅ Use Australian business terminology appropriately
✅ Focus on actionable insights rather than just technical details

TECHNICAL REQUIREMENTS:
- Use valid GraphQL syntax with curly braces
- Use camelCase field names (contactEmail, createdAt, startDate)
- Use double quotes for all string values
- Use Hasura filter operators: _eq, _neq, _gt, _gte, _lt, _lte, _in, _nin, _like, _ilike
- Structure: query Name {{ table(filters, sorting, limit) {{ fields, relationships {{ fields }} }} }}

RESPONSE FORMAT (must be valid JSON):
{{
  "query": "query GetActiveClientsWithDetails {{ clients(where: {{ active: {{ _eq: true }} }}, order_by: {{ createdAt: desc }}, limit: 15) {{ id name contactPerson contactEmail contactPhone createdAt payrolls(where: {{ status: {{ _eq: \\"active\\" }} }}, limit: 3) {{ id name status startDate endDate }} }} }}",
  "explanation": "This comprehensive query retrieves active clients with their contact details and recent payroll activity. It provides insights into client engagement levels, contact information for business development, and current payroll commitments. The data helps assess client relationship health and identify opportunities for growth or attention."
}}`;
}

export function buildChatContextPrompt(
  userRole: string,
  currentPage: string
): string {
  return `User Role: ${userRole}
Current Page: ${currentPage}

Provide helpful assistance for payroll management tasks. If the user needs data, offer to generate appropriate GraphQL queries.`;
}