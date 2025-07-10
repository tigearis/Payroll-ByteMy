# AI Assistant Setup Guide

## Overview

The AI Assistant integration has been successfully implemented in the Payroll Matrix application. This guide covers the final setup steps and usage instructions.

## 🔧 Manual Configuration Required

### 1. Clerk JWT Template Update

**IMPORTANT**: You must manually update your Clerk JWT template to include the `ai_assistant` role.

#### Steps:
1. Go to your Clerk Dashboard
2. Navigate to "JWT Templates"
3. Select your existing Hasura template
4. Update the template to include `ai_assistant` in the allowed roles:

```json
{
  "https://hasura.io/jwt/claims": {
    "metadata": "{{user.public_metadata}}",
    "x-hasura-role": "{{user.public_metadata.role}}",
    "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
    "x-hasura-default-role": "viewer",
    "x-hasura-allowed-roles": [
      "developer",
      "org_admin", 
      "manager",
      "consultant",
      "viewer",
      "ai_assistant"
    ],
    "x-hasura-clerk-user-id": "{{user.id}}"
  }
}
```

5. Save the template
6. Test that the AI assistant can access the API endpoints

### 2. Hasura Metadata Application

Apply the updated Hasura metadata to enable the AI assistant role:

```bash
cd hasura
hasura metadata apply
```

### 3. Install Dependencies

Install the new LangChain dependencies:

```bash
pnpm install
```

## 🚀 Features Implemented

### Core AI Services
- ✅ LangChain integration with Ollama (Llama3:8b)
- ✅ Secure GraphQL query generation
- ✅ Multi-layer security validation
- ✅ Context-aware assistance
- ✅ Rate limiting and audit logging

### User Interface
- ✅ Floating AI assistant accessible from any page
- ✅ Expandable/collapsible chat interface
- ✅ Drag-and-drop positioning
- ✅ Context-aware suggestions
- ✅ Query result visualization
- ✅ Export capabilities

### Security Features
- ✅ Read-only database access via Hasura roles
- ✅ Query validation and sanitization
- ✅ Rate limiting (30 requests/minute)
- ✅ Comprehensive audit logging
- ✅ Field-level access restrictions
- ✅ User permission inheritance

## 🔒 Security Implementation

### Database Access Control
The AI assistant uses a dedicated `ai_assistant` Hasura role with:
- **SELECT-only permissions** on approved tables
- **No INSERT, UPDATE, DELETE** capabilities
- **Row-level security** inheritance from user context
- **Field-level restrictions** on sensitive data

### Safe Tables (Full Access)
- `payrolls` and related tables
- `clients` 
- `work_schedule`
- `holidays`
- `notes`
- `leave`
- `user_skills`
- Reporting and analytics tables

### Restricted Tables (Limited Fields)
- `users` - Basic info only (no auth fields)
- `app_settings` - Public settings only

### Forbidden Tables (Zero Access)
- All `audit.*` tables
- Authentication/permission tables
- Financial/billing tables
- System internal tables

## 📊 Usage Examples

### General Chat
Users can ask natural language questions:
- "Show me recent payroll activity"
- "What clients need attention?"
- "Help me understand this data"

### Query Generation
The AI can generate and execute GraphQL queries:
- "List all active clients with their managers"
- "Show payrolls due this week"
- "Get staff capacity overview"

### Contextual Help
The assistant provides page-specific suggestions:
- Dashboard: Overview and recent activity
- Payrolls: Status updates and assignments
- Clients: Performance metrics
- Staff: Capacity and skills analysis

## 🛠️ Technical Architecture

### API Endpoints
- `/api/ai-assistant/chat` - Main chat interface
- `/api/ai-assistant/query` - Query generation and execution
- `/api/ai-assistant/context` - Page context extraction

### Components
- `AIAssistantFloat` - Floating interface
- `AIChat` - Chat interface with query visualization
- Context extractors and security validators

### Services
- `langChainService` - Core AI integration
- `hasuraQueryGenerator` - GraphQL query generation
- `securityValidator` - Query validation
- `contextExtractor` - Page context analysis

## 🔍 Monitoring & Debugging

### Audit Logging
All AI interactions are logged with:
- User context and permissions
- Generated queries and results
- Security validation results
- Performance metrics

### Rate Limiting
- **Chat**: 30 requests/minute per user
- **Queries**: 10 requests/minute per user
- **Global**: 2000 requests/hour system-wide

### Error Handling
- Graceful degradation when AI service unavailable
- Sanitized error messages (no internal details exposed)
- Automatic retry with exponential backoff

## 🚨 Troubleshooting

### Common Issues

1. **"Authentication required" errors**
   - Verify JWT template includes `ai_assistant` role
   - Check Hasura metadata has been applied

2. **"Access denied" errors**
   - Confirm table permissions are configured
   - Verify user has valid role assignment

3. **Rate limit exceeded**
   - Wait for rate limit window to reset
   - Reduce query frequency

4. **AI service unavailable**
   - Check LLM endpoint (https://llm.bytemy.com.au)
   - Verify API connectivity
   - Check server logs for errors

### Debug Mode
For developers, additional logging can be enabled by setting:
```javascript
// In browser console
localStorage.setItem('ai-debug', 'true');
```

## 📈 Performance Considerations

### Optimization
- GraphQL query complexity limits enforced
- Result caching for common queries
- Connection pooling for database access
- Lazy loading of chat interface

### Recommended Limits
- Keep queries under 50 fields
- Limit query depth to 6 levels
- Use pagination for large result sets
- Consider aggregations over individual records

## 🔮 Future Enhancements

### Planned Features
- [ ] Voice input/output capabilities
- [ ] Advanced data visualization
- [ ] Custom report generation
- [ ] Integration with external business intelligence tools
- [ ] Multi-language support
- [ ] Workflow automation suggestions

### Extension Points
- Custom query templates
- Domain-specific AI models
- Integration with other LLM providers
- Advanced analytics and insights

## 💡 Best Practices

### For Users
- Be specific in your questions
- Use business terminology
- Ask for clarification when needed
- Review generated queries before relying on results

### For Developers
- Always validate AI-generated queries
- Monitor rate limits and usage patterns
- Review audit logs regularly
- Test permission boundaries
- Keep security configurations up to date

## 📞 Support

For technical issues or questions:
1. Check the troubleshooting section above
2. Review audit logs for error details
3. Consult the security documentation
4. Contact the development team

---

**Security Note**: The AI assistant operates with read-only access and inherits user permissions. All interactions are logged for audit purposes. Never share sensitive authentication details with the AI assistant.