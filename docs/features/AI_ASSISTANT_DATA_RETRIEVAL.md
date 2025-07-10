# AI Assistant Data Retrieval

## Overview

The AI assistant has been enhanced to automatically execute GraphQL queries and return real data from the database, rather than just generating query examples.

## How It Works

### 1. Natural Language Processing

When a user asks for data using natural language, the AI assistant:

- Detects data requests using keywords like "show", "list", "get", "find", "what", "how many", "display", "retrieve"
- Automatically routes these requests to the query generation and execution system
- Generates appropriate GraphQL queries based on the request

### 2. Query Generation & Execution

The system:

- Uses the LangChain service with Llama3:8b model to generate GraphQL queries
- Validates queries against security rules and user permissions
- Executes queries using the unified Apollo client
- Returns actual data from the database

### 3. Data Presentation

Results are presented with:

- Natural language summary of the data
- Raw query results in JSON format
- Security validation status
- Export functionality for data download

## Supported Data Types

### Safe Tables (Full Access)

- `payrolls` - Payroll information and processing
- `clients` - Client management data
- `work_schedule` - Staff scheduling
- `payroll_dates` - Payroll date management
- `holidays` - Holiday calendar
- `notes` - Documentation and notes
- `leave` - Leave management
- `user_skills` - Staff skills and capabilities
- `consultant_capacity_overview` - Capacity planning

### Restricted Tables (Limited Access)

- `users` - Basic user information (no sensitive data)

### Forbidden Tables (No Access)

- Audit tables (`audit_log`, `auth_events`, etc.)
- Financial tables (`billing_*`, etc.)
- System internals (`permissions`, `roles`, etc.)

## Example Queries

### Basic Data Requests

```
"Show me active clients"
"List recent payrolls"
"What's today's schedule?"
"How many staff are working today?"
"Show upcoming holidays"
"List all consultants"
```

### Complex Queries

```
"Show payrolls for client ABC Corp from last month"
"Find staff with accounting skills"
"Display leave requests pending approval"
"What's the capacity overview for this week?"
```

## Security Features

### Query Validation

- All queries are validated against security rules
- Access is restricted based on user roles
- Forbidden tables are blocked
- Query complexity is monitored

### Audit Logging

- All query executions are logged
- Security violations are tracked
- User context is recorded
- Performance metrics are collected

## User Interface

### Chat Interface

- Automatic detection of data requests
- Real-time query execution
- Natural language summaries
- Data export functionality
- Error handling and display

### Floating Assistant

- Accessible from any page
- Context-aware suggestions
- Compact data display
- Quick access to common queries

## API Endpoints

### POST /api/ai-assistant/query

Generates and executes GraphQL queries based on natural language requests.

**Request Body:**

```json
{
  "request": "Show me active clients",
  "context": {
    "pathname": "/dashboard",
    "pageData": {}
  }
}
```

**Response:**

```json
{
  "query": "query { clients(where: {status: {_eq: \"active\"}}) { id name status } }",
  "explanation": "I found 5 active clients in your system...",
  "data": {
    "clients": [{ "id": "123", "name": "ABC Corp", "status": "active" }]
  },
  "security": {
    "isValid": true,
    "report": "Query passed security validation"
  }
}
```

## Configuration

### Environment Variables

- `LLM_API_KEY` - Required for AI query generation
- Rate limiting settings in the code

### Rate Limiting

- 10 queries per minute per user
- 30 chat messages per minute per user
- Automatic throttling and error responses

## Troubleshooting

### Common Issues

1. **"Query generation failed"**

   - Check LLM_API_KEY is set
   - Verify network connectivity to llm.bytemy.com.au
   - Review request format

2. **"Access denied to requested data"**

   - User lacks required permissions
   - Requested table is forbidden
   - Security validation failed

3. **"Query execution failed"**
   - GraphQL syntax error
   - Database connection issue
   - Schema mismatch

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` to see detailed error messages and query execution logs.

## Future Enhancements

- [ ] Caching for frequently requested data
- [ ] Advanced query optimization
- [ ] Natural language query builder UI
- [ ] Scheduled report generation
- [ ] Integration with external data sources
- [ ] Advanced analytics and insights
