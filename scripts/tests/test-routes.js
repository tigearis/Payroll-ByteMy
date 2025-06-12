// test-routes.js - Quick route testing script
const routes = [
  "/dashboard",
  "/payrolls",
  "/payrolls/1",
  "/clients",
  "/clients/1",
  "/staff",
  "/staff/1",
  "/calendar",
  "/settings",
  "/ai-assistant",
  "/tax-calculator",
  "/payroll-schedule",
  "/developer",
];

async function testRoute(route) {
  try {
    const response = await fetch(`http://localhost:3000${route}`);
    const status = response.status;
    const statusText = response.statusText;

    if (status === 200) {
      console.log(`✅ ${route} - ${status} ${statusText}`);
    } else if (status === 307 || status === 302) {
      console.log(`🔄 ${route} - ${status} ${statusText} (Redirect)`);
    } else if (status === 404) {
      console.log(`❌ ${route} - ${status} ${statusText} (Not Found)`);
    } else if (status === 500) {
      console.log(`💥 ${route} - ${status} ${statusText} (Server Error)`);
    } else {
      console.log(`⚠️  ${route} - ${status} ${statusText}`);
    }
  } catch (error) {
    console.log(`💥 ${route} - Error: ${error.message}`);
  }
}

async function testAllRoutes() {
  console.log("Testing routes...\n");
  for (const route of routes) {
    await testRoute(route);
  }
}

testAllRoutes();
