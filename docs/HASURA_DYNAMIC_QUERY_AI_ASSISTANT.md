# Hasura Dynamic Query AI Assistant

## Overview

The Hasura Dynamic Query AI Assistant is an intelligent database assistant that answers questions about your business data by dynamically generating and executing GraphQL queries against your Hasura instance. It provides direct, conversational answers without exposing technical query details to users.

## Features

### 🔍 Dynamic Schema Introspection
- Automatically discovers your Hasura GraphQL schema
- Understands table relationships and field types
- Adapts to schema changes in real-time
- Provides context-aware query suggestions

### 🧠 Intelligent Query Generation
- Converts natural language questions into GraphQL queries
- Understands business intent and context
- Handles complex relationships and joins
- Optimizes queries for performance

### 🛡️ Security & Permissions
- Respects role-based access controls
- Validates queries before execution
- Prevents access to sensitive data
- Logs all interactions for audit purposes

### 💡 Business Intelligence
- Provides actionable insights, not just raw data
- Summarizes results in business terms
- Identifies trends and patterns
- Suggests related questions and analysis

## Architecture

### Core Components

1. **HasuraDataAssistant** (`/components/ai/hasura-data-assistant.tsx`)
   - Main UI component for conversational interface
   - Handles user interactions and displays results
   - Provides business-focused data presentation

2. **Data Answer API** (`/app/api/ai-assistant/data-answer/route.ts`)
   - Processes natural language questions
   - Generates and executes GraphQL queries
   - Returns business-focused answers with insights

3. **Query Generator** (`/lib/ai/hasura-query-generator.ts`)
   - Dynamically generates GraphQL queries
   - Manages schema introspection
   - Handles security validation

4. **LangChain Service** (`/lib/ai/langchain-service.ts`)
   - Powers the AI conversation capabilities
   - Generates query explanations and insights
   - Provides contextual suggestions

### Data Flow

```
User Question → AI Analysis → GraphQL Generation → Hasura Execution → Business Insights → User Answer
```

## Usage Examples

### Basic Data Questions
- "How many active clients do we have?"
- "Show me payrolls from this month"
- "Who's working today?"

### Business Analysis
- "Which clients are most profitable?"
- "What's our average payroll processing time?"
- "Show me team capacity this week"

### Comparative Queries
- "How does this quarter compare to last quarter?"
- "Which consultants have the highest utilization?"
- "What are our busiest days of the week?"

## API Endpoints

### POST `/api/ai-assistant/data-answer`

Ask questions about business data and get direct answers.

**Request Body:**
```json
{
  "question": "How many active clients do we have?",
  "context": {
    "pathname": "/dashboard",
    "pageData": {...}
  }
}
```

**Response:**
```json
{
  "answer": "You currently have 47 active clients. This represents a 12% increase from last quarter, indicating strong business growth.",
  "insights": [
    "Client acquisition is trending positively",
    "Consider capacity planning for growth"
  ],
  "recordCount": 47,
  "businessContext": "Client Management",
  "executionTime": 234,
  "relatedQuestions": [
    "Which clients joined recently?",
    "Show me client activity levels"
  ],
  "metadata": {
    "hasData": true,
    "queryGenerated": true,
    "securityValidated": true,
    "dataSource": "hasura-graphql"
  }
}
```

### GET `/api/ai-assistant/query?pathname=/dashboard`

Get suggested queries for the current context.

## Configuration

### Environment Variables

```env
# Required for AI functionality
LLM_API_KEY=your_ollama_api_key
NEXT_PUBLIC_HASURA_GRAPHQL_URL=https://your-hasura-instance.com/v1/graphql
HASURA_GRAPHQL_ADMIN_SECRET=your_admin_secret

# Optional: Custom Ollama endpoint
OLLAMA_BASE_URL=https://llm.bytemy.com.au
```

### Hasura Setup

1. **JWT Authentication**: Configure Clerk JWT template for Hasura
2. **Row Level Security**: Enable RLS on sensitive tables
3. **Role-based Permissions**: Set up appropriate permissions for each role
4. **Introspection**: Enable GraphQL introspection for schema discovery

### Security Configuration

The assistant respects these security boundaries:

- **Safe Tables**: Core business data (payrolls, clients, work_schedule)
- **Restricted Tables**: Limited access with field-level filtering (users)
- **Forbidden Tables**: No access (audit logs, auth tables, billing)

## User Interface

### Main Components

1. **Question Input**: Natural language question interface
2. **Answer Display**: Business-focused response with insights
3. **Data Visualization**: Rich presentation of query results
4. **Related Questions**: Suggested follow-up queries
5. **Export Options**: Download data in various formats

### User Experience

- **Conversational**: Ask questions in natural language
- **Contextual**: Suggestions based on current page
- **Visual**: Rich data presentation with charts and tables
- **Actionable**: Business insights and recommendations

## Role-based Access

### Access Levels

- **Developer**: Full access to all data and debug information
- **Org Admin**: Complete business data access
- **Manager**: Department-level data access
- **Consultant**: Project and client-specific data
- **Viewer**: Read-only access to basic information

### Permissions

The assistant automatically respects your existing Hasura permissions:

- Only shows data you're authorized to see
- Filters results based on your role
- Provides appropriate error messages for restricted data

## Development

### Adding New Business Domains

1. Update `SAFE_TABLES` in `hasura-query-generator.ts`
2. Add business context logic in `determineBusinessContext()`
3. Create domain-specific response templates
4. Add suggested questions for the new domain

### Customizing Responses

Modify these functions in `data-answer/route.ts`:

- `generateBusinessAnswer()`: Customize answer formatting
- `extractBusinessInsights()`: Add domain-specific insights
- `generateRelatedQuestions()`: Create contextual suggestions

### Schema Updates

The assistant automatically adapts to schema changes through:

- Real-time introspection
- Dynamic query generation
- Context-aware suggestions

## Monitoring & Analytics

### Logs

All interactions are logged with:
- User ID and role
- Question and answer content
- Execution time and performance metrics
- Security validation results
- Business context and data accessed

### Metrics

Track these key metrics:
- Questions per user/role
- Response accuracy and relevance
- Query performance and optimization
- User satisfaction and engagement

## Best Practices

### For Users

1. **Be Specific**: "Show me new clients this month" vs "Show me clients"
2. **Use Business Terms**: "revenue" instead of "billing_amount"
3. **Ask Follow-ups**: Use suggested related questions
4. **Context Matters**: Ask questions relevant to current page

### For Developers

1. **Security First**: Always validate permissions and data access
2. **Performance**: Monitor query complexity and execution time
3. **User Experience**: Focus on business value, not technical details
4. **Monitoring**: Log and analyze user interactions

## Troubleshooting

### Common Issues

**"I don't have permission to access that data"**
- Check your role assignments
- Verify Hasura permissions
- Contact your administrator

**"No data found matching your criteria"**
- Try broader search terms
- Check date ranges
- Verify data exists in the system

**"Query execution failed"**
- Check Hasura connectivity
- Verify schema is up to date
- Review server logs for details

### Performance Issues

- Monitor query complexity
- Add database indexes for frequently queried fields
- Implement query result caching
- Set appropriate rate limits

## Future Enhancements

### Planned Features

1. **Advanced Visualizations**: Charts, graphs, and dashboards
2. **Query Caching**: Improve performance for common questions
3. **Export Formats**: PDF reports, Excel sheets, presentations
4. **Scheduled Reports**: Automated recurring insights
5. **Custom Dashboards**: Personalized data views

### Integration Opportunities

- **Slack/Teams**: Bot integration for team queries
- **Email Reports**: Automated business summaries
- **Mobile App**: On-the-go data access
- **Voice Interface**: Ask questions using voice commands

## Support

For assistance with the Hasura Dynamic Query AI Assistant:

1. Check this documentation
2. Review the application logs
3. Test with simpler questions first
4. Contact your system administrator

## Contributing

To contribute to the AI assistant:

1. Follow the existing code patterns
2. Add comprehensive tests
3. Update documentation
4. Consider security implications
5. Test with various user roles