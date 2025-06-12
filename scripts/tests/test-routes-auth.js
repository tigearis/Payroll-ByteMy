// test-routes-auth.js - Route testing with authentication
const routes = [
  "/dashboard",
  "/payrolls",
  "/clients",
  "/staff",
  "/calendar",
  "/settings",
  "/ai-assistant",
  "/tax-calculator",
  "/payroll-schedule",
  "/developer",
];

const detailRoutes = ["/payrolls/1", "/clients/1", "/staff/1"];

async function testAuthenticatedRoute(route) {
  try {
    // Test the route by making a request that simulates a browser
    const response = await fetch(`http://localhost:3000${route}`, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
      },
      redirect: "manual", // Don't follow redirects automatically
    });

    const status = response.status;
    const statusText = response.statusText;

    if (status === 200) {
      // Check if it's actually a valid page by looking for common indicators
      const text = await response.text();
      if (text.includes("__NEXT_DATA__") || text.includes("React")) {
        console.log(`✅ ${route} - ${status} ${statusText} (Valid Page)`);
      } else {
        console.log(
          `⚠️  ${route} - ${status} ${statusText} (Possible Error Page)`
        );
      }
    } else if (status === 307 || status === 302) {
      const location = response.headers.get("location");
      if (location?.includes("/sign-in")) {
        console.log(
          `🔐 ${route} - ${status} ${statusText} (Auth Required → ${location})`
        );
      } else {
        console.log(
          `🔄 ${route} - ${status} ${statusText} (Redirect → ${location})`
        );
      }
    } else if (status === 404) {
      console.log(`❌ ${route} - ${status} ${statusText} (Not Found)`);
    } else if (status === 500) {
      console.log(`💥 ${route} - ${status} ${statusText} (Server Error)`);
    } else if (status === 401 || status === 403) {
      console.log(`🚫 ${route} - ${status} ${statusText} (Access Denied)`);
    } else {
      console.log(`⚠️  ${route} - ${status} ${statusText}`);
    }
  } catch (error) {
    console.log(`💥 ${route} - Error: ${error.message}`);
  }
}

async function testClerkAuth() {
  console.log("🔍 Testing Clerk Authentication Setup...\n");

  try {
    // Test if Clerk is properly configured
    const clerkResponse = await fetch("http://localhost:3000/sign-in");
    if (clerkResponse.status === 200) {
      console.log("✅ Clerk sign-in page accessible");
    } else {
      console.log(`❌ Clerk sign-in issue: ${clerkResponse.status}`);
    }
  } catch (error) {
    console.log(`💥 Clerk test error: ${error.message}`);
  }
}

async function testAllRoutesWithAuth() {
  await testClerkAuth();

  console.log("\n📄 Testing Main Routes...\n");
  for (const route of routes) {
    await testAuthenticatedRoute(route);
    await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
  }

  console.log("\n🔍 Testing Detail Routes...\n");
  for (const route of detailRoutes) {
    await testAuthenticatedRoute(route);
    await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
  }

  console.log("\n📊 Test Summary:");
  console.log("🔐 Auth Required - Routes need authentication");
  console.log("❌ Not Found - Route doesn't exist or middleware blocking");
  console.log("✅ Valid Page - Route loads successfully");
  console.log("💥 Server Error - Internal application error");
}

testAllRoutesWithAuth();
