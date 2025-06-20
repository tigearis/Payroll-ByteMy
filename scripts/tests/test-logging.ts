// Test script to verify SOC2 logging functionality
import { soc2Logger, LogLevel, LogCategory, SOC2EventType } from './lib/logging/soc2-logger';

async function testLogging() {
  console.log('🧪 Testing SOC2 logging functionality...');
  
  try {
    // Test 1: Basic authentication log
    console.log('📝 Test 1: Authentication log');
    await soc2Logger.log({
      level: LogLevel.INFO,
      category: LogCategory.AUTHENTICATION,
      eventType: SOC2EventType.LOGIN_SUCCESS,
      message: "Test login successful",
      userId: "test-user-123",
      userEmail: "test@example.com",
      metadata: {
        testRun: true,
        timestamp: new Date().toISOString()
      }
    });
    console.log('✅ Authentication log test completed');

    // Test 2: Data access log
    console.log('📝 Test 2: Data access log');
    await soc2Logger.log({
      level: LogLevel.INFO,
      category: LogCategory.DATA_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      message: "Test data access",
      userId: "test-user-123",
      entityType: "users",
      entityId: "test-entity-456",
      metadata: {
        testRun: true,
        fields: ["id", "name", "email"],
        rowCount: 1
      }
    });
    console.log('✅ Data access log test completed');

    console.log('🎉 All logging tests completed successfully!');

  } catch (error: any) {
    console.error('❌ Logging test failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Check if it's a GraphQL error
    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', error.graphQLErrors);
    }
    
    // Check if it's a network error
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
  }
}

// Run the test
testLogging().then(() => {
  console.log('🏁 Test script completed');
}).catch((error) => {
  console.error('💥 Test script failed:', error);
});