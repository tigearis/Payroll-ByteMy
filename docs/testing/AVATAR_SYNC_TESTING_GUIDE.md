# Avatar Sync Testing Guide

This guide explains how to test the new avatar URL priority system that prioritizes external account avatars over Clerk's default image URLs.

## 🧪 Testing Methods

### 1. Unit Testing (Recommended First Step)

Test the core avatar priority logic:

```bash
# Run the avatar priority logic tests
node scripts/test-avatar-sync.js
```

This tests:
- External account avatar prioritization
- Fallback to image_url when no external avatar
- Multiple external accounts handling  
- Different avatar property names (avatar_url, picture, etc.)
- Edge cases (no avatars at all)

### 2. Webhook Simulation Testing

Test how webhook payloads are processed:

```bash
# Run webhook simulation with mock data
node scripts/test-webhook-simulation.js
```

This simulates:
- A Clerk webhook with external accounts
- Avatar URL extraction from webhook data
- Preview of what would be synced to database

### 3. Manual User Sync Testing

Test with real Clerk user data:

```bash
# Test with a real Clerk user ID
node scripts/manual-user-sync.js user_2abc123def456

# Replace with actual Clerk user ID from your system
```

This will:
- Fetch real user data from Clerk
- Show external accounts and their avatars
- Display which avatar URL would be selected
- Preview the database sync (safe - doesn't actually sync by default)

### 4. Live Webhook Testing

Test with real webhook events:

#### Option A: Trigger User Update in Clerk Dashboard
1. Go to your Clerk Dashboard
2. Find a test user with external accounts (Google, GitHub, etc.)
3. Make a small change (like first name)
4. Save the user
5. Check your webhook logs for avatar URL processing

#### Option B: Create Test User with External Account
1. Use your app's sign-up flow
2. Sign up with Google/GitHub OAuth
3. Check webhook logs to see avatar URL selection
4. Verify database user record has the external account avatar

### 5. Database Verification

Check that avatars are properly stored:

```sql
-- Check user avatars in database
SELECT 
  id,
  first_name,
  last_name,
  email,
  image,
  clerk_user_id,
  created_at
FROM users 
WHERE image IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
```

### 6. Production Monitoring

Monitor avatar sync in production:

```bash
# Check webhook logs for avatar URL processing
grep "🖼️ Extracting best avatar URL" /path/to/webhook/logs

# Look for successful external account usage
grep "✅ Using external account avatar" /path/to/webhook/logs

# Check for fallbacks to image_url
grep "✅ Using fallback image_url" /path/to/webhook/logs
```

## 🔍 What to Look For

### Success Indicators

1. **Priority Logic Working**:
   ```
   ✅ Using external account avatar_url: https://lh3.googleusercontent.com/...
   ```

2. **Proper Fallback**:
   ```
   ⚠️ External accounts found but no avatar_url in any account
   ✅ Using fallback image_url: https://img.clerk.com/...
   ```

3. **Database Updates**:
   - User records show high-quality external account avatars
   - Avatar URLs from Google, GitHub, etc. instead of Clerk defaults

### Troubleshooting

If external account avatars aren't being used:

1. **Check External Account Structure**:
   ```javascript
   // Log the external accounts array
   console.log('External accounts:', user.externalAccounts);
   ```

2. **Verify Property Names**:
   - Different providers use different property names
   - Current code checks: `avatar_url`, `avatarUrl`, `picture`, `avatar`

3. **Check Permissions**:
   - Ensure your OAuth app has permission to access profile photos
   - Some providers require specific scopes

## 📋 Test Checklist

- [ ] Unit tests pass (`node scripts/test-avatar-sync.js`)
- [ ] Webhook simulation shows correct prioritization
- [ ] Manual user sync displays expected avatar URL
- [ ] New user creation via OAuth uses external account avatar
- [ ] User updates preserve avatar URL priority
- [ ] Database contains high-quality avatar URLs
- [ ] Fallback to image_url works when no external avatar available
- [ ] Production logs show successful avatar extraction

## 🚨 Safety Notes

- The manual sync script is safe by default (preview mode)
- Uncomment the actual sync code only when you're ready to test database changes
- Always test with non-production users first
- Keep backups of user data before testing sync changes

## 📞 Need Help?

If you encounter issues:

1. Check the webhook logs for detailed avatar URL processing
2. Verify your Clerk OAuth provider settings
3. Test with users who have confirmed external account avatars
4. Review the `getBestAvatarUrl` function logic in `user-sync.ts`