#!/usr/bin/env node

/**
 * OAuth Flow Test Script
 *
 * This script helps test the OAuth authentication flow to ensure
 * the redirect loop issue has been resolved.
 */

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function displayTestInstructions() {
  log("cyan", "🧪 OAuth Flow Test Instructions");
  log("cyan", "=====================================\n");

  log("blue", "1. Manual Testing Steps:");
  console.log("   • Open your application in a browser");
  console.log("   • Navigate to /sign-in");
  console.log('   • Click "Continue with Google"');
  console.log("   • Complete Google OAuth flow");
  console.log("   • Verify successful redirect to /dashboard");
  console.log("   • Check browser network tab for redirect loops\n");

  log("blue", "2. Things to Watch For:");
  console.log("   ❌ Infinite redirects between /dashboard → /dashboard");
  console.log("   ❌ Browser hanging or becoming unresponsive");
  console.log('   ❌ "Too many redirects" error messages');
  console.log("   ✅ Smooth redirect to dashboard after OAuth");
  console.log("   ✅ User successfully authenticated and synced\n");

  log("blue", "3. Browser Console Logs to Check:");
  console.log('   • Look for "🔒 MIDDLEWARE STARTED" logs');
  console.log('   • Check for "⏳ Session not fully loaded" messages');
  console.log('   • Verify "🔄 OAuth flow detected" appears for OAuth users');
  console.log(
    '   • Ensure "⏳ Already on dashboard, allowing access" prevents loops\n'
  );

  log("blue", "4. Test Scenarios:");
  console.log("   a) New OAuth user (first time sign-in)");
  console.log("   b) Existing OAuth user (returning user)");
  console.log("   c) OAuth user with slow network connection");
  console.log("   d) Multiple OAuth attempts in different tabs");
  console.log("   e) Email/password sign-in (ensure no regression)\n");
}

function displayFixSummary() {
  log("green", "🔧 OAuth Redirect Loop Fix Summary");
  log("green", "==================================\n");

  log("yellow", "Problem:");
  console.log("• OAuth users were getting stuck in redirect loops");
  console.log(
    "• Middleware was redirecting /dashboard → /dashboard infinitely"
  );
  console.log("• JWT claims were incomplete during OAuth flow\n");

  log("yellow", "Solution:");
  console.log(
    "• Added check to prevent redirecting when already on /dashboard"
  );
  console.log("• Added OAuth flow detection in middleware");
  console.log("• Made JWT claims validation more forgiving for OAuth flows");
  console.log("• Enhanced logging for better debugging\n");

  log("yellow", "Files Modified:");
  console.log("• middleware.ts - Fixed redirect loop logic");
  console.log(
    "• lib/auth/token-utils.ts - Enhanced hasCompleteData validation"
  );
  console.log(
    "• OAUTHREDIRECTLOOP_ANALYSIS_REPORT.md - Comprehensive analysis\n"
  );
}

function displayMonitoringCommands() {
  log("blue", "📊 Monitoring Commands");
  log("blue", "======================\n");

  console.log("# Monitor application logs during OAuth testing:");
  console.log(
    'tail -f .next/server.log | grep -E "(MIDDLEWARE|OAuth|redirect|dashboard)"\n'
  );

  console.log("# Check for redirect loops in browser:");
  console.log(
    "# Open Browser DevTools → Network tab → Look for repeated /dashboard requests\n"
  );

  console.log("# Test OAuth flow with curl (replace with actual URLs):");
  console.log(
    'curl -I -L "http://localhost:3000/dashboard" -H "Referer: https://clerk.accounts.dev"\n'
  );
}

function displayTroubleshooting() {
  log("red", "🔍 Troubleshooting Guide");
  log("red", "========================\n");

  log("yellow", "If OAuth loops still occur:");
  console.log('1. Check middleware logs for "Already on dashboard" message');
  console.log("2. Verify JWT claims are being retrieved correctly");
  console.log("3. Ensure Clerk JWT template is configured properly");
  console.log("4. Check for multiple authentication guards conflicting\n");

  log("yellow", "Common Issues:");
  console.log("• Network timeouts during OAuth → Increase timeout values");
  console.log("• Clerk JWT template missing → Configure in Clerk dashboard");
  console.log("• Database sync failing → Check sync API endpoints");
  console.log("• Multiple auth guards → Simplify authentication flow\n");

  log("yellow", "Emergency Rollback:");
  console.log("If issues persist, you can temporarily disable OAuth by:");
  console.log("• Commenting out Google OAuth button in sign-in page");
  console.log("• Reverting middleware.ts changes");
  console.log("• Using email/password authentication only\n");
}

function main() {
  console.clear();
  log("cyan", "🚀 OAuth Flow Testing & Validation Tool\n");

  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    displayTestInstructions();
    displayFixSummary();
    displayMonitoringCommands();
    displayTroubleshooting();
    return;
  }

  if (args.includes("--fix-summary")) {
    displayFixSummary();
    return;
  }

  if (args.includes("--monitor")) {
    displayMonitoringCommands();
    return;
  }

  if (args.includes("--troubleshoot")) {
    displayTroubleshooting();
    return;
  }

  // Default: Show test instructions
  displayTestInstructions();

  log("green", "✅ Ready to test OAuth flow!");
  log("yellow", "Run with --help to see all options\n");

  // Additional options
  console.log("Available options:");
  console.log("  --fix-summary    Show what was fixed");
  console.log("  --monitor        Show monitoring commands");
  console.log("  --troubleshoot   Show troubleshooting guide");
  console.log("  --help, -h       Show all information\n");
}

if (require.main === module) {
  main();
}

module.exports = {
  displayTestInstructions,
  displayFixSummary,
  displayMonitoringCommands,
  displayTroubleshooting,
};
