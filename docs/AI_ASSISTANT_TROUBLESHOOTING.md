# AI Assistant Troubleshooting Guide

## Common Issues and Solutions

### Issue: "not a valid graphql query" Error

**Problem**: The AI is not returning properly formatted JSON, causing GraphQL parsing to fail.

**Root Cause**: The LLM sometimes ignores JSON formatting instructions and returns conversational responses.

**Solutions Implemented**:

1. **Enhanced Prompt Engineering** (`lib/ai/safe-prompt-builder.ts`)
   - Added multiple "CRITICAL" warnings about JSON-only responses
   - Included explicit "FAILURE TO RESPOND WITH ONLY JSON WILL RESULT IN SYSTEM ERROR"
   - Added "START YOUR RESPONSE WITH { AND END WITH }" instruction

2. **Improved JSON Parsing** (`lib/ai/langchain-service.ts`)
   - Enhanced cleaning of AI responses (removes markdown, extracts JSON blocks)
   - Added regex-based JSON extraction from mixed content
   - Better error handling and logging

3. **Robust Fallback System**
   - Intelligent fallback query generation based on user intent
   - Multiple fallback levels (smart → basic → ultimate)
   - User-friendly error messages

### Issue: AI Assistant Not Accessible

**Problem**: Users getting permission errors when trying to use the AI assistant.

**Access Requirements**:
- **Chat Interface**: Manager+ role required
- **Query Generation**: Consultant+ role required
- **Data Assistant**: Consultant+ role required

**Check User Role**:
```bash
# In browser console
console.log(user?.publicMetadata?.role);
```

### Issue: Schema Introspection Failures

**Problem**: AI can't access the latest GraphQL schema from Hasura.

**Solutions**:
1. **Check Environment Variables**:
   ```env
   NEXT_PUBLIC_HASURA_GRAPHQL_URL=https://your-hasura-instance.com/v1/graphql
   HASURA_GRAPHQL_ADMIN_SECRET=your_admin_secret
   ```

2. **Verify Hasura Connectivity**:
   ```bash
   curl -H "X-Hasura-Admin-Secret: your_secret" \
        -H "Content-Type: application/json" \
        -d '{"query": "{ __schema { types { name } } }"}' \
        https://your-hasura-instance.com/v1/graphql
   ```

3. **Check Introspection Settings**:
   - Ensure GraphQL introspection is enabled in Hasura
   - Verify admin secret is correct

### Issue: Rate Limiting

**Problem**: "Too many requests" errors.

**Current Limits**:
- Chat: 30 requests per minute
- Query Generation: 10 requests per minute  
- Data Answers: 20 requests per minute

**Solutions**:
- Wait for rate limit reset
- Reduce frequency of requests
- For developers: Use debug endpoints for testing

### Issue: Poor Query Results

**Problem**: AI generates queries that don't return useful data.

**Troubleshooting Steps**:

1. **Check Question Clarity**:
   ```
   ❌ "Show me stuff"
   ✅ "Show me active clients from this month"
   ```

2. **Verify Schema Context**:
   - Use debug endpoint to check schema loading
   - Ensure table names match your schema

3. **Test Fallback Queries**:
   ```bash
   node scripts/test-ai-query-generation.cjs
   ```

### Issue: Authentication Failures

**Problem**: JWT token issues causing Hasura authentication to fail.

**Debug Steps**:

1. **Check Clerk Configuration**:
   - Verify JWT template is set up for Hasura
   - Ensure claims are properly configured

2. **Test Token Generation**:
   ```javascript
   // In browser console
   const token = await window.Clerk.session.getToken({template: "hasura"});
   console.log("JWT Token:", token);
   ```

3. **Verify Hasura JWT Settings**:
   - Check `HASURA_GRAPHQL_JWT_SECRET` configuration
   - Ensure JWT template matches Hasura expectations

## Debug Tools

### 1. Debug Query Endpoint

Test AI query generation in isolation:

```bash
curl -X POST /api/ai-assistant/debug-query \
  -H "Content-Type: application/json" \
  -H "x-user-role: developer" \
  -d '{"message": "show me active clients"}'
```

### 2. Test Script

Run local tests for query parsing logic:

```bash
node scripts/test-ai-query-generation.cjs
```

### 3. Browser Console Debugging

Monitor AI assistant network requests:

```javascript
// Watch for AI requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  if (args[0].includes('/api/ai-assistant/')) {
    console.log('AI Request:', args);
  }
  return originalFetch.apply(this, args);
};
```

## Performance Optimization

### 1. Query Complexity

Monitor query complexity and execution time:
- Limit nested relationships
- Use appropriate pagination
- Add database indexes for frequently queried fields

### 2. AI Model Optimization

Current settings (in `lib/ai/langchain-service.ts`):
```javascript
{
  model: "llama3:8b",
  temperature: 0.1,  // Low for consistent results
  topP: 0.9,
  numCtx: 4096      // Context window
}
```

### 3. Caching Strategy

Consider implementing:
- Query result caching for common requests
- Schema introspection caching
- AI response caching for repeated questions

## Monitoring and Logging

### Key Log Points

1. **AI Request Processing**: `🔍 [AI Query Parsing]`
2. **Query Generation**: `🚀 Starting query generation`
3. **Hasura Execution**: `❌ [LangChain Service] Query execution failed`
4. **Security Validation**: `🔑 [AI Query API] Retrieved JWT token`

### Log Analysis

Common error patterns:
```bash
# Find JSON parsing failures
grep "❌.*JSON" logs/*

# Find Hasura connection issues  
grep "Query execution failed" logs/*

# Find rate limiting issues
grep "Rate limit exceeded" logs/*
```

## Development Guidelines

### Adding New Business Domains

1. Update `SAFE_TABLES` in `hasura-query-generator.ts`
2. Add business context in `determineBusinessContext()`
3. Create domain-specific fallback queries
4. Add example questions to UI

### Testing New Features

1. Use debug endpoint for isolated testing
2. Test with different user roles
3. Verify rate limiting behavior
4. Check error handling paths

### Security Considerations

1. **Never expose admin secrets** in client-side code
2. **Validate all user inputs** before processing
3. **Log all AI interactions** for audit purposes
4. **Respect rate limits** to prevent abuse
5. **Use role-based access control** consistently

## Support Escalation

### Level 1: User Issues
- Check user role and permissions
- Verify question format and clarity
- Test with simpler questions

### Level 2: Technical Issues  
- Check environment variables
- Verify Hasura connectivity
- Review application logs

### Level 3: AI Model Issues
- Check Ollama service status
- Verify model availability
- Review prompt engineering
- Consider model fine-tuning

### Level 4: Architecture Issues
- Review system architecture
- Consider scaling requirements
- Evaluate alternative AI providers
- Plan infrastructure upgrades