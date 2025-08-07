# Hasura Cron Job Setup - Holiday Sync

## Overview

Automated holiday synchronization has been configured using Hasura cron triggers to keep Australian public holiday data up-to-date for accurate EFT date calculations.

## Cron Jobs Configured

### 1. Monthly Holiday Sync
- **Schedule**: `0 2 1 * *` (1st of every month at 2 AM UTC)
- **Purpose**: Regular sync, skips if data already exists
- **Endpoint**: `https://payroll.bytemy.com.au/api/cron/holidays/sync`
- **Payload**: `{"force": false}`

### 2. Quarterly Force Sync
- **Schedule**: `0 3 1 1,4,7,10 *` (January, April, July, October at 3 AM UTC)
- **Purpose**: Force sync to ensure data freshness
- **Endpoint**: `https://payroll.bytemy.com.au/api/cron/holidays/sync`
- **Payload**: `{"force": true}`

## Authentication

The cron jobs use a secret key for authentication via the `x-hasura-cron-secret` header.

### Current Configuration
- **Secret Value**: `[REDACTED_CRON_SECRET]`
- **Header**: `x-hasura-cron-secret`

### Security Improvement Required

The current configuration uses a hardcoded secret value in the metadata. For better security, the `CRON_SECRET` environment variable should be added to the Hasura environment configuration.

#### Steps to Implement Environment Variable:

1. **Add to Hasura Environment**:
   ```bash
   CRON_SECRET=[REDACTED_CRON_SECRET]
   ```

2. **Update Cron Trigger Metadata**:
   ```yaml
   headers:
     - name: x-hasura-cron-secret
       value_from_env: CRON_SECRET
   ```

3. **Apply Metadata**:
   ```bash
   hasura metadata apply
   ```

## API Endpoint Details

### `/api/cron/holidays/sync`

**Purpose**: Cron-specific endpoint for automated holiday synchronization

**Authentication**: 
- Header: `x-hasura-cron-secret`
- Value: Must match `CRON_SECRET` environment variable

**Request Body**:
```json
{
  "force": false  // Set to true for force sync
}
```

**Response**:
```json
{
  "success": true,
  "message": "Holiday sync completed",
  "details": {
    "totalAffected": 25,
    "skippedCount": 0,
    "forceSync": false,
    "triggerType": "cron",
    "results": [...]
  }
}
```

## Holiday Sync Features

- **Comprehensive Coverage**: Syncs all Australian states/territories
- **Smart Consolidation**: Groups holidays by date across jurisdictions
- **EFT Relevance**: Marks NSW/National holidays for payroll processing
- **Data Source**: Australian Government data.gov.au API
- **Error Handling**: Comprehensive retry logic and error logging

## Monitoring

### Successful Execution
- Check application logs for `🤖 Automated holiday sync started`
- Verify `✅ Automated holiday sync completed` messages

### Failed Execution
- Look for `❌ Automated holiday sync error` in logs
- Check Hasura cron trigger status in admin console
- Verify endpoint accessibility and authentication

## Manual Testing

Test the cron endpoint manually:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-hasura-cron-secret: [REDACTED_CRON_SECRET]" \
  -d '{"force": false}' \
  https://payroll.bytemy.com.au/api/cron/holidays/sync
```

## Files Modified

- `/hasura/metadata/cron_triggers.yaml` - Cron trigger configuration
- `/app/api/cron/holidays/sync/route.ts` - Cron-specific API endpoint
- `.env.local` - Contains `CRON_SECRET` environment variable

## Next Steps

1. **Environment Variable Setup**: Add `CRON_SECRET` to Hasura environment
2. **Update Metadata**: Switch from hardcoded value to environment variable
3. **Monitor Execution**: Verify cron jobs run successfully on schedule
4. **Documentation**: Update deployment guides with environment setup

## Security Notes

- The cron secret should be treated as sensitive information
- Regular rotation of cron secrets is recommended
- Monitor for unauthorized access attempts in logs
- Ensure the endpoint is only accessible via the configured webhook URL