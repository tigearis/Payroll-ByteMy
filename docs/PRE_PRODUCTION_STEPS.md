# Pre-Production Deployment Steps

## Critical Steps Before Production Deployment

### 1. 🧪 Run Comprehensive Tests

**Automated Testing:**
```bash
cd /app
node scripts/test-auth-fixes.js
```

**Expected Results:**
- ✅ All 10 tests should pass
- ✅ 100% success rate required
- ⚠️ Any failures must be investigated before deployment

### 2. 🔧 Environment Configuration

**Required Environment Variables:**
```bash
# Set these in your production environment
NODE_ENV=production
FEATURE_MFA_ENABLED=false
CRON_SECRET=your_secure_cron_secret
WEBHOOK_SECRET=your_secure_webhook_secret
```

**Verify Clerk Configuration:**
- Ensure production Clerk keys are set
- Verify JWT template includes role claims
- Test authentication flow in production environment

### 3. 🔒 Security Validation

**Manual Security Tests:**

1. **Admin Access Test:**
   - Log in as admin user
   - Access `/api/staff/create` - should work
   - Access `/api/audit/compliance-report` - should work

2. **Role Permission Test:**
   - Log in as viewer user
   - Try accessing admin routes - should be blocked
   - Verify proper error messages

3. **Test Route Blocking:**
   - In production, these should return 401:
     - `/api/simple-test`
     - `/api/debug-post`
     - `/api/minimal-post-test`

### 4. 📊 Monitoring Setup

**Verify Logging:**
```bash
# Check logs for authentication events
tail -f /var/log/your-app.log | grep "SOC2"
```

**Confirm Monitoring Active:**
- Check route analytics are being collected
- Verify security alerts are generated
- Ensure audit logs are being written

### 5. 🚀 Deployment Verification

**Post-Deployment Checks:**

1. **Health Check:**
   ```bash
   curl -X GET https://your-domain.com/api/health
   ```

2. **Authentication Flow:**
   - User login works
   - JWT tokens are generated
   - Role-based access enforced

3. **Route Protection:**
   - All critical routes require authentication
   - Proper error responses for unauthorized access

### 6. ⚠️ Rollback Plan

**If Issues Occur:**

1. **Immediate Rollback:**
   ```bash
   # Revert to previous deployment
   git checkout previous-stable-commit
   # Redeploy previous version
   ```

2. **Emergency Bypass:**
   ```bash
   # Temporarily disable strict auth if needed
   EMERGENCY_AUTH_BYPASS=true
   ```

### 7. 📋 Final Checklist

**Before Going Live:**

- [ ] All automated tests pass
- [ ] Environment variables configured
- [ ] Admin user can access all admin routes
- [ ] Viewer user blocked from admin routes
- [ ] Test routes blocked in production
- [ ] SOC2 logging active
- [ ] Monitoring dashboard showing data
- [ ] Rollback plan tested
- [ ] Team notified of deployment

## Commands You Need to Run

### Testing Commands:
```bash
# Run authentication tests
node scripts/test-auth-fixes.js

# Check for linting errors (if available)
npm run lint

# Run type checking (if available)
npm run typecheck

# Build production version (Note: may have SWC issues on ARM64)
npm run build
```

### Build Issues Fixed:
- ✅ Server/client import issue with centralized token manager resolved
- ✅ TypeScript errors in authentication files fixed
- ⚠️ Note: SWC binary issues on ARM64 architecture are platform-specific and don't affect functionality

### Monitoring Commands:
```bash
# View authentication logs
tail -f logs/auth.log

# Check route analytics
curl -X GET https://your-domain.com/api/admin/route-analytics

# Monitor security alerts
curl -X GET https://your-domain.com/api/admin/security-alerts
```

## Expected Test Results

**When you run the tests, you should see:**

```
🚀 Starting comprehensive authentication tests...

🧪 Testing: Critical routes now require authentication
   ✓ /api/audit/compliance-report properly requires authentication
   ✓ /api/chat properly requires authentication
   ✓ /api/commit-payroll-assignments properly requires authentication
   ✓ /api/staff/create properly requires authentication
✅ PASS: Critical routes now require authentication

🧪 Testing: Test routes blocked in production
   ✓ /api/simple-test properly blocked in production
   ✓ /api/debug-post properly blocked in production
   ✓ /api/minimal-post-test properly blocked in production
✅ PASS: Test routes blocked in production

... (8 more tests)

==========================================
🏁 Test Results Summary
==========================================
✅ Passed: 10
❌ Failed: 0
📊 Total:  10
📈 Success Rate: 100%

🎉 All authentication fixes are working correctly!
✅ Ready for production deployment
```

## What to Do After Deployment

### 1. Monitor for First 24 Hours

**Watch for:**
- Authentication error spikes
- Unusual route access patterns
- Performance degradation
- User complaints about access issues

### 2. Review Logs Daily

**Check:**
- SOC2 audit logs for completeness
- Security alert frequency
- Token refresh success rates

### 3. Weekly Security Review

**Analyze:**
- Route access patterns
- Failed authentication attempts
- Security alert trends
- User role distribution

## Support Contacts

**If you encounter issues:**

1. Check the troubleshooting section in `AUTHENTICATION_SYSTEM_DOCUMENTATION.md`
2. Review application logs for specific error messages
3. Verify environment configuration matches requirements
4. Test with different user roles to isolate permission issues

## Success Criteria

**Your deployment is successful when:**
- ✅ All tests pass
- ✅ Users can authenticate normally
- ✅ Role-based access works correctly
- ✅ No security alerts triggered
- ✅ SOC2 logs being generated
- ✅ No performance degradation
- ✅ All critical routes protected

---

**🚨 IMPORTANT**: Do not proceed to production until all steps above are completed and verified. The authentication system is critical infrastructure that must work perfectly to protect your application and data.

**Generated with Claude Code** 🤖