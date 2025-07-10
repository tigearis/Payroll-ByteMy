/**
 * Safe Prompt Builder for AI Assistant
 * 
 * Builds prompts that work with LangChain without template syntax conflicts
 */

import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";

export function createQueryGenerationPrompt(
  systemPrompt: string,
  userRole: string,
  currentPage: string,
  availableSchema: string,
  userMessage: string
): ChatPromptTemplate {
  // Create messages directly without using template strings
  const systemMessage = new SystemMessage(systemPrompt);
  
  // Build context message as a plain string
  const contextContent = [
    `User Role: ${userRole}`,
    `Current Page: ${currentPage}`,
    '',
    'Available GraphQL Schema and Business Context:',
    availableSchema,
    '',
    'TASK: Generate a comprehensive GraphQL query based on the user\'s request.',
    '',
    'CRITICAL INSTRUCTION: YOU MUST RESPOND WITH ONLY A VALID JSON OBJECT. NO OTHER TEXT.',
    'DO NOT provide explanations, markdown, or any text outside the JSON.',
    'DO NOT use conversational language.',
    'DO NOT say "I\'ll help you" or similar phrases.',
    '',
    'REQUIRED JSON FORMAT:',
    '- query: A comprehensive GraphQL query string with proper syntax',
    '- explanation: A business-focused explanation of what insights the query provides',
    '- variables: Any variables needed (optional)',
    '',
    'QUERY GENERATION STRATEGY:',
    '1. **Understand Business Intent**: What business question is the user really asking?',
    '2. **Select Comprehensive Fields**: Include all relevant fields that provide business context',
    '3. **Include Relationships**: Fetch related data that adds business value',
    '4. **Apply Smart Filtering**: Use appropriate filters to get the most relevant data',
    '5. **Optimize for Insights**: Structure the query to enable meaningful analysis',
    '',
    'QUERY EXCELLENCE CRITERIA:',
    '✅ Include essential business fields (names, dates, statuses, amounts)',
    '✅ Fetch meaningful relationships (client details for payrolls, user info for assignments)',
    '✅ Use appropriate filtering (active records, recent dates, relevant statuses)',
    '✅ Add sorting for consistent, logical results',
    '✅ Include reasonable limits for performance',
    '✅ Select fields that enable business analysis and decision-making',
    '',
    'EXPLANATION EXCELLENCE CRITERIA:',
    '✅ Explain the business value and insights the query provides',
    '✅ Highlight key data points and their business significance',
    '✅ Mention potential use cases for the data',
    '✅ Use Australian business terminology appropriately',
    '✅ Focus on actionable insights rather than just technical details',
    '',
    'TECHNICAL REQUIREMENTS:',
    '- Use valid GraphQL syntax with curly braces',
    '- Use camelCase field names (contactEmail, createdAt, startDate)',
    '- Use double quotes for all string values',
    '- Use Hasura filter operators: _eq, _neq, _gt, _gte, _lt, _lte, _in, _nin, _like, _ilike',
    '- IMPORTANT: Use camelCase for arguments: where, orderBy, limit, offset (NOT order_by, NOT where_clause)',
    '- IMPORTANT: Use UPPERCASE for sort direction: ASC, DESC (not asc, desc)',
    '- Structure: query Name { table(where: {...}, orderBy: { field: ASC }, limit: N) { fields, relationships { fields } } }',
    '',
    'CRITICAL: YOU MUST RESPOND WITH ONLY VALID JSON. NO MARKDOWN, NO EXPLANATIONS OUTSIDE THE JSON.',
    'FAILURE TO RESPOND WITH ONLY JSON WILL RESULT IN SYSTEM ERROR.',
    '',
    'EXACT RESPONSE FORMAT REQUIRED:',
    '{',
    '  "query": "query GetActiveClientsWithDetails { clients(where: { active: { _eq: true } }, orderBy: { createdAt: DESC }, limit: 15) { id name contactPerson contactEmail contactPhone createdAt payrolls(where: { status: { _eq: \\"active\\" } }, limit: 3) { id name status startDate endDate } } }",',
    '  "explanation": "This comprehensive query retrieves active clients with their contact details and recent payroll activity. It provides insights into client engagement levels, contact information for business development, and current payroll commitments. The data helps assess client relationship health and identify opportunities for growth or attention.",',
    '  "variables": {}',
    '}',
    '',
    'FINAL REMINDER: YOUR ENTIRE RESPONSE MUST BE THE JSON OBJECT ABOVE. NO ADDITIONAL TEXT.',
    'START YOUR RESPONSE WITH { AND END WITH }',
  ].join('\n');
  
  const contextMessage = new SystemMessage(contextContent);
  const humanMessage = new HumanMessage(userMessage);
  
  // Create prompt from pre-built messages
  return ChatPromptTemplate.fromMessages([
    systemMessage,
    contextMessage,
    humanMessage
  ]);
}