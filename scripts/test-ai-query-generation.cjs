/**
 * Test script for AI query generation
 * 
 * This script tests the AI query generation process to debug the JSON parsing issues
 */

// Test JSON parsing logic
function testQueryParsing() {
  console.log("🧪 Testing Query Parsing Logic");
  
  // Test case 1: Proper JSON response
  const goodResponse = `{
    "query": "query GetClients { clients(limit: 10) { id name active } }",
    "explanation": "This query retrieves basic client information",
    "variables": {}
  }`;
  
  // Test case 2: JSON wrapped in markdown
  const markdownResponse = `\`\`\`json
{
  "query": "query GetClients { clients(limit: 10) { id name active } }",
  "explanation": "This query retrieves basic client information",
  "variables": {}
}
\`\`\``;
  
  // Test case 3: JSON with extra text
  const messyResponse = `I'll help you generate a query:

{
  "query": "query GetClients { clients(limit: 10) { id name active } }",
  "explanation": "This query retrieves basic client information",
  "variables": {}
}

This should work for your needs.`;

  // Test case 4: Bad response (current issue)
  const badResponse = `I'd be happy to help you generate a comprehensive GraphQL query that provides maximum business value and insights!

Based on your request, I understand that you want to retrieve active clients with their contact details and recent payroll activity. Here's a suggested query:

**Query**

**Explanation**
This query retrieves active clients with their contact details and recent payroll activity. The data provides insights into client engagement levels, contact information for business development, and current payroll commitments. The query helps assess client relationship health and identify opportunities for growth or attention.

**Variables**

* None required`;

  function parseQueryResponse(response) {
    console.log("📄 Parsing response:", response.substring(0, 100) + "...");
    
    // Clean up the response - remove any markdown formatting
    let cleanedResponse = response.trim();
    
    // Remove markdown code blocks if present
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    cleanedResponse = cleanedResponse.replace(/```\s*/g, '').replace(/```\s*$/g, '');
    
    // Try to extract JSON from the response if it's wrapped in other text
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
      console.log("  📋 Found JSON block:", cleanedResponse.substring(0, 50) + "...");
    } else {
      console.log("  ❌ No JSON block found");
    }
    
    try {
      const parsed = JSON.parse(cleanedResponse);
      console.log("  ✅ Successfully parsed JSON");
      
      if (parsed.query && parsed.explanation) {
        console.log("  ✅ Has required fields");
        return { success: true, result: parsed };
      } else {
        console.log("  ⚠️ Missing required fields");
        return { success: false, error: "Missing required fields" };
      }
    } catch (jsonError) {
      console.log("  ❌ JSON parse error:", jsonError.message);
      return { success: false, error: jsonError.message };
    }
  }

  // Test all cases
  console.log("\n1. Testing good JSON response:");
  parseQueryResponse(goodResponse);
  
  console.log("\n2. Testing markdown-wrapped JSON:");
  parseQueryResponse(markdownResponse);
  
  console.log("\n3. Testing messy response with extra text:");
  parseQueryResponse(messyResponse);
  
  console.log("\n4. Testing bad response (current issue):");
  parseQueryResponse(badResponse);
}

// Test fallback query generation
function testFallbackQueries() {
  console.log("\n🔄 Testing Fallback Query Generation");
  
  const questions = [
    "Show me active clients",
    "List all payrolls",
    "Who's working today?",
    "What's the schedule?",
    "Show me recent activity"
  ];
  
  function generateFallbackQuery(question) {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("client")) {
      return `query GetClients {
        clients(limit: 10, orderBy: { createdAt: DESC }) {
          id
          name
          active
          contactPerson
          contactEmail
          createdAt
        }
      }`;
    }
    
    if (lowerQuestion.includes("payroll")) {
      return `query GetPayrolls {
        payrolls(limit: 10, orderBy: { createdAt: DESC }) {
          id
          name
          status
          goLiveDate
          supersededDate
          client {
            id
            name
          }
        }
      }`;
    }
    
    if (lowerQuestion.includes("working") || lowerQuestion.includes("schedule")) {
      return `query GetWorkSchedule {
        workSchedule(limit: 10, orderBy: { date: DESC }) {
          id
          date
          workHours
          adminTimeHours
          user {
            id
            name
            position
          }
        }
      }`;
    }
    
    return `query GetBasicData {
      clients(limit: 5, where: { active: { _eq: true } }) {
        id
        name
        active
        contactPerson
      }
    }`;
  }
  
  questions.forEach(question => {
    console.log(`📝 Question: "${question}"`);
    const fallback = generateFallbackQuery(question);
    console.log(`✅ Fallback: ${fallback.split('\n')[0]}...`);
    console.log();
  });
}

// Run tests
if (require.main === module) {
  testQueryParsing();
  testFallbackQueries();
}

module.exports = { testQueryParsing, testFallbackQueries };