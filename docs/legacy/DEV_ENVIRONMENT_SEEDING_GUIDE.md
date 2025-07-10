# Development Environment Seeding Guide

## Quick Start for Development Environment

The comprehensive seeding system has been configured for your **development environment**. Here are the updated commands:

```bash
# Basic seeding for development
pnpm dev:seed

# Preview what would be created (dry run)
pnpm dev:seed:dry-run

# Clean existing dev data and reseed
pnpm dev:seed:clean

# Validate data integrity
pnpm dev:validate

# Full cycle: clean, seed, and validate
pnpm dev:seed:full
```

## ⚙️ Environment Configuration

The system now automatically loads environment variables in this order:
1. `.env.local` (highest priority)
2. `.env.development`
3. `.env` (fallback)

### Required Environment Variables

Ensure you have these variables set in your `.env.local` or `.env.development`:

```bash
# Primary Hasura endpoint
HASURA_GRAPHQL_URL=your_dev_hasura_endpoint

# Admin secret for Hasura
HASURA_ADMIN_SECRET=your_admin_secret

# Fallback (optional)
E2E_HASURA_GRAPHQL_URL=your_hasura_endpoint
```

## 🏷️ Development Data Pattern

All development seed data now uses `@dev.` email patterns:
- **Dev Users**: `name.surname@dev.payroll.com`
- **Easy Identification**: Clear distinction from production data
- **Safe Cleanup**: Only dev-patterned data is affected by cleanup operations

## Updated Commands

### Seeding Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `pnpm dev:seed` | Standard development seeding | Daily development work |
| `pnpm dev:seed:minimal` | Minimal dev data (5 users, 3 clients) | Quick testing |
| `pnpm dev:seed:testing` | Full test data (25 users, 15 clients) | Comprehensive testing |
| `pnpm dev:seed:performance` | Large dataset (100 users, 50 clients) | Performance testing |
| `pnpm dev:seed:clean` | Clean existing dev data first | Fresh start |
| `pnpm dev:seed:dry-run` | Preview without making changes | Planning, debugging |

### Validation Commands

| Command | Description | Output |
|---------|-------------|---------|
| `pnpm dev:validate` | Basic validation checks | Console summary |
| `pnpm dev:validate:verbose` | Detailed validation output | Full details in console |
| `pnpm dev:validate:report` | Generate HTML report with performance | Report files |
| `pnpm dev:seed:full` | Complete cycle with validation | Full workflow |

## 🔍 Environment Detection

The system automatically detects your environment:
- **LOCAL**: `localhost` in the endpoint URL
- **REMOTE**: External Hasura endpoints
- **PRODUCTION WARNING**: Alerts if using production-like endpoints

Example output:
```
🔗 Using Hasura endpoint: https://your-app.hasura.app/***
📝 Environment detected: REMOTE
⚠️  WARNING: This appears to be a production endpoint. Ensure this is intentional.
   Test data will be clearly marked with @dev. email patterns.
```

## 🚀 Getting Started

### 1. Check Your Environment
```bash
# Verify your environment variables
echo $HASURA_GRAPHQL_URL
echo $HASURA_ADMIN_SECRET

# Test connection with dry run
pnpm dev:seed:dry-run
```

### 2. First Time Setup
```bash
# Create development data
pnpm dev:seed

# Validate everything is working
pnpm dev:validate:verbose
```

### 3. Daily Development
```bash
# Refresh your development data
pnpm dev:seed:clean

# Or just add fresh data
pnpm dev:seed
```

## 📊 What Gets Created for Development

### User Accounts (15 users)
- **Developer**: `developer@dev.payroll.com`
- **Org Admin**: `sarah.chen@dev.payroll.com`
- **Managers**: `marcus.rodriguez@dev.payroll.com` and others
- **Consultants**: Multiple consultant accounts
- **Viewers**: Read-only access accounts

### Business Data
- **10 Clients**: Across Technology, Healthcare, Construction, Retail, Professional Services
- **50 Payrolls**: With 6 months of historical data
- **Complete Schedules**: Weekly, fortnightly, and monthly cycles
- **User Activities**: Leave records, work schedules, notes

## 🔒 Safety Features for Development

### Data Preservation
- **Existing Users Protected**: Your real user accounts are never modified
- **Dev Pattern Isolation**: Only `@dev.` accounts are managed by seeding
- **Automatic Backups**: Critical data backed up before operations
- **Transaction Safety**: Operations can be rolled back if needed

### Environment Safeguards
- **Production Warnings**: Alerts when using production-like endpoints
- **Clear Identification**: All dev data clearly marked
- **Safe Cleanup**: Only dev-specific data is removed during cleanup
- **Dry Run Testing**: Preview changes before execution

## 🛠️ Development Workflows

### Schema Changes
```bash
# After updating database schema
pnpm dev:validate:verbose

# If validation fails, refresh data
pnpm dev:seed:full
```

### Feature Development
```bash
# Start with clean slate
pnpm dev:seed:clean

# Create appropriate dataset for your feature
pnpm dev:seed:testing  # For complex features
# OR
pnpm dev:seed:minimal  # For simple features
```

### Performance Testing
```bash
# Create large dataset
pnpm dev:seed:performance

# Monitor performance
pnpm dev:validate:report
```

### Before Deployment
```bash
# Ensure data quality
pnpm dev:validate:report

# Clean up dev environment
pnpm dev:seed:clean
```

## 🔧 Troubleshooting Development Issues

### Connection Problems
```bash
# Check environment variables
echo "Endpoint: $HASURA_GRAPHQL_URL"
echo "Secret: ${HASURA_ADMIN_SECRET:0:10}..."

# Test connection
pnpm dev:seed:dry-run
```

### Permission Issues
- Verify `HASURA_ADMIN_SECRET` is correct
- Check network connectivity to Hasura
- Ensure admin secret has proper permissions

### Data Conflicts
```bash
# Clean and start fresh
pnpm dev:seed:clean

# Try minimal for debugging
pnpm dev:seed:minimal
```

### Validation Failures
```bash
# Get detailed information
pnpm dev:validate:verbose

# Check specific issues in HTML report
pnpm dev:validate:report
open data-validation-report.html
```

## 📁 Generated Files

Development seeding creates these files:
- `test-data-seed-report.json` - Detailed seeding results
- `data-validation-report.json` - Validation results
- `data-validation-report.html` - Visual validation report

## 🎯 Best Practices for Development

### Daily Development
- Use `pnpm dev:seed` for standard development
- Run `pnpm dev:validate` after schema changes
- Use dry run mode when testing new configurations

### Team Consistency
- Share the same seeding profile across the team
- Document any custom data requirements
- Use validation reports to catch issues early

### Environment Management
- Keep `.env.local` for personal settings
- Use `.env.development` for team defaults
- Never commit real credentials to git

## 🔄 Migration from Test to Dev

If you were previously using test commands, here's the mapping:

| Old Test Command | New Dev Command |
|------------------|-----------------|
| `pnpm test:comprehensive:seed` | `pnpm dev:seed` |
| `pnpm test:comprehensive:validate` | `pnpm dev:validate` |
| `pnpm test:comprehensive:dry-run` | `pnpm dev:seed:dry-run` |
| `pnpm test:comprehensive:full` | `pnpm dev:seed:full` |

The functionality is identical - only the environment configuration and data patterns have changed from `@test.` to `@dev.`.

---

## Quick Reference

```bash
# Most common commands for development:
pnpm dev:seed              # Standard development seeding
pnpm dev:seed:dry-run      # Preview changes safely
pnpm dev:validate          # Check data integrity
pnpm dev:seed:clean        # Fresh start
```

Your development environment is now ready for comprehensive, safe, and realistic test data seeding! 🚀