# 🕐 Payroll Date Generation - Cron Jobs Setup

## Overview

This system ensures that payroll dates are always generated **2 years in advance** through automated cron jobs and immediate generation on payroll creation.

## 🎯 **Strategy**

### **1. Immediate Generation (On Payroll Creation)**

- When a new payroll is created, **2 years of dates are generated immediately**
- Uses the `generate_payroll_dates_two_years()` function
- Provides instant availability for planning and scheduling

### **2. Monthly Maintenance (1st of Every Month)**

- Generates additional dates to maintain 2-year coverage
- Identifies payrolls that need date generation
- Bulk processes all active payrolls

### **3. Annual Cleanup (January 1st)**

- Removes processed dates older than 1 year
- Optimizes database performance
- Maintains historical data for recent payrolls

### **4. Weekly Health Checks (Every Monday)**

- Analysis-only run to identify potential issues
- Reports on date coverage across all payrolls
- Early warning system for coverage gaps

## 🛠 **Database Functions**

### **Core Functions**

```sql
-- Generate 2 years of dates for a single payroll
SELECT * FROM generate_payroll_dates_two_years(
  p_payroll_id := 'uuid-here',
  p_start_date := CURRENT_DATE
);

-- Bulk generate dates for all active payrolls
SELECT * FROM generate_all_payroll_dates_bulk(p_years_ahead := 2);

-- Check coverage across all payrolls
SELECT * FROM check_payroll_date_coverage();

-- Get system statistics
SELECT * FROM get_payroll_date_stats();

-- Cleanup old processed dates
SELECT * FROM cleanup_old_payroll_dates();
```

## 🔗 **API Endpoints**

### **1. Bulk Date Generation**

```bash
# Monthly generation (via cron)
POST /api/cron/generate-bulk-dates
Headers: x-cron-secret: your-cron-secret

# Manual generation
POST /api/cron/generate-bulk-dates
Headers: authorization: Bearer your-token
Body: { "yearsAhead": 2 }

# Health check only
GET /api/cron/generate-bulk-dates?checkOnly=true
Headers: authorization: Bearer your-token
```

### **2. Cleanup Operations**

```bash
# Annual cleanup (via cron)
POST /api/cron/cleanup-old-dates
Headers: x-cron-secret: your-cron-secret

# Preview cleanup (dry run)
GET /api/cron/cleanup-old-dates
Headers: authorization: Bearer your-token
```

## ⏰ **Cron Schedule**

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-bulk-dates",
      "schedule": "0 2 1 * *",
      "description": "Monthly bulk generation - 1st at 2 AM UTC"
    },
    {
      "path": "/api/cron/cleanup-old-dates",
      "schedule": "0 3 1 1 *",
      "description": "Annual cleanup - January 1st at 3 AM UTC"
    },
    {
      "path": "/api/cron/generate-bulk-dates?checkOnly=true",
      "schedule": "0 1 * * 1",
      "description": "Weekly health check - Mondays at 1 AM UTC"
    }
  ]
}
```

## 🚀 **Deployment Setup**

### **1. Environment Variables**

```bash
# Add to .env.local
CRON_SECRET=your-secure-random-secret-here
HASURA_GRAPHQL_ADMIN_SECRET=your-hasura-admin-secret
HASURA_GRAPHQL_URL=your-hasura-endpoint
```

### **2. Database Migration**

```bash
# Apply the new functions
psql -d your_database -f database/cron_payroll_functions.sql
```

### **3. Hasura Function Registration**

```bash
# Add functions to Hasura metadata
hasura metadata apply
```

### **4. Vercel Deployment**

```bash
# Deploy with cron configuration
vercel deploy --prod

# Verify cron jobs are scheduled
vercel crons ls
```

## 📊 **Monitoring & Alerts**

### **Key Metrics to Monitor**

- **Date Coverage**: Ensure all payrolls have at least 1 year of future dates
- **Generation Success Rate**: >99% of bulk operations should succeed
- **Processing Time**: Monthly jobs should complete within 5 minutes
- **Database Growth**: Monitor payroll_dates table size

### **Health Check Queries**

```sql
-- Check minimum date coverage
SELECT
  COUNT(*) as payrolls_with_insufficient_coverage
FROM (
  SELECT
    p.id,
    COALESCE(MAX(pd.original_eft_date), p.start_date) - CURRENT_DATE as days_ahead
  FROM payrolls p
  LEFT JOIN payroll_dates pd ON p.id = pd.payroll_id
  WHERE p.active = true
  GROUP BY p.id, p.start_date
  HAVING COALESCE(MAX(pd.original_eft_date), p.start_date) - CURRENT_DATE < 365
) insufficient;

-- Database table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE tablename IN ('payrolls', 'payroll_dates')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 🔧 **Manual Operations**

### **Emergency Date Generation**

```bash
# Generate dates for a specific payroll
curl -X POST "https://your-app.vercel.app/api/cron/generate-bulk-dates" \
  -H "authorization: Bearer your-token" \
  -H "content-type: application/json" \
  -d '{"yearsAhead": 2}'
```

### **Coverage Analysis**

```bash
# Check current system status
curl -X GET "https://your-app.vercel.app/api/cron/generate-bulk-dates?checkOnly=true" \
  -H "authorization: Bearer your-token"
```

### **Cleanup Preview**

```bash
# See what would be cleaned up
curl -X GET "https://your-app.vercel.app/api/cron/cleanup-old-dates" \
  -H "authorization: Bearer your-token"
```

## 🛡 **Security Considerations**

### **Cron Secret Authentication**

- Use a strong, random secret for `CRON_SECRET`
- Rotate the secret quarterly
- Monitor for unauthorized cron attempts

### **Database Permissions**

- Cron functions use Hasura admin access
- Functions are granted minimal required permissions
- All operations are logged for audit

### **Rate Limiting**

- Bulk operations process payrolls sequentially
- Built-in error handling prevents cascading failures
- Timeouts prevent runaway processes

## 🐛 **Troubleshooting**

### **Common Issues**

#### **"Cron job failed to start"**

- Check `CRON_SECRET` environment variable
- Verify Vercel cron configuration
- Check function deployment status

#### **"No dates generated"**

- Verify Hasura admin secret
- Check database function permissions
- Review payroll active status

#### **"Database connection timeout"**

- Monitor database connection pool
- Check for long-running queries
- Verify Hasura endpoint accessibility

### **Debug Commands**

```bash
# Test database functions directly
psql -d your_database -c "SELECT * FROM get_payroll_date_stats();"

# Check Hasura function availability
curl -X POST "your-hasura-url/v1/graphql" \
  -H "x-hasura-admin-secret: your-secret" \
  -d '{"query": "query { get_payroll_date_stats { total_active_payrolls } }"}'

# Verify cron endpoint health
curl -X GET "https://your-app.vercel.app/api/cron/generate-bulk-dates" \
  -H "authorization: Bearer test-token"
```

## 📈 **Performance Optimization**

### **Database Indexing**

```sql
-- Ensure optimal indexes exist
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payroll_dates_future
ON payroll_dates (payroll_id, original_eft_date)
WHERE original_eft_date > CURRENT_DATE;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payrolls_active
ON payrolls (active, start_date)
WHERE active = true;
```

### **Batch Processing**

- Process payrolls in batches of 10
- Use database transactions for consistency
- Implement exponential backoff for retries

### **Monitoring Queries**

```sql
-- Long-running date generation
SELECT
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query
FROM pg_stat_activity
WHERE query LIKE '%generate_payroll_dates%'
AND state = 'active';
```

## 🎯 **Success Metrics**

- **✅ 100% Coverage**: All active payrolls have 2+ years of dates
- **✅ <5 min Processing**: Monthly bulk operations complete quickly
- **✅ 99.9% Uptime**: Cron jobs execute reliably
- **✅ Zero Manual Intervention**: System runs autonomously
- **✅ Audit Trail**: All operations are logged and traceable

---

This cron job system ensures your payroll dates are always available 2 years in advance, providing predictable scheduling and eliminating last-minute date availability issues.
