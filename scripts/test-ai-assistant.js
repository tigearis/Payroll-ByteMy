/**
 * Test script for AI Assistant Query Functionality
 *
 * This script tests the AI assistant's ability to generate and execute GraphQL queries
 */

// Using built-in fetch (Node.js 18+)

// Test configuration
const TEST_CONFIG = {
  baseUrl: "http://localhost:3000",
  testQueries: [
    "Show me active clients",
    "List recent payrolls",
    "What's today's work schedule?",
    "Show upcoming holidays",
  ],
};

async function testAIAssistant() {
  console.log("🧪 Testing AI Assistant Query Functionality\n");

  for (const query of TESTCONFIG.testQueries) {
    console.log(`📝 Testing query: "${query}"`);

    try {
      const response = await fetch(
        `${TESTCONFIG.baseUrl}/api/ai-assistant/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-role": "manager", // Test with manager role
          },
          body: JSON.stringify({
            request: query,
            context: {
              pathname: "/ai-assistant",
            },
          }),
        }
      );

      if (!response.ok) {
        console.log(`❌ HTTP Error: ${response.status} ${response.statusText}`);
        continue;
      }

      const data = await response.json();

      console.log(`✅ Query generated successfully`);
      console.log(
        `📊 Security: ${data.security?.isValid ? "✅ Valid" : "❌ Invalid"}`
      );
      console.log(`🔍 Explanation: ${data.explanation}`);

      if (data.data) {
        console.log(
          `📈 Data returned: ${Object.keys(data.data).length} root fields`
        );
        // Show a sample of the data structure
        Object.keys(data.data).forEach(key => {
          const value = data.data[key];
          if (Array.isArray(value)) {
            console.log(`   - ${key}: ${value.length} records`);
          } else if (typeof value === "object") {
            console.log(
              `   - ${key}: object with ${Object.keys(value).length} fields`
            );
          } else {
            console.log(`   - ${key}: ${value}`);
          }
        });
      }

      if (data.errors && data.errors.length > 0) {
        console.log(
          `⚠️  Errors: ${data.errors.map(e => e.message).join(", ")}`
        );
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }

    console.log(""); // Empty line for readability
  }

  console.log("🏁 Test completed");
}

// Run the test
testAIAssistant().catch(console.error);
