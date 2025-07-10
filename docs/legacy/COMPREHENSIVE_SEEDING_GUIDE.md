# Comprehensive Test Data Seeding Guide

## Quick Start

The comprehensive seeding system is now ready to use. Here are the most common commands:

```bash
# Basic seeding (development profile)
pnpm test:comprehensive:seed

# Preview what would be created (dry run)
pnpm test:comprehensive:dry-run

# Clean existing test data and reseed
pnpm test:comprehensive:clean

# Validate data integrity
pnpm test:comprehensive:validate

# Full cycle: clean, seed, and validate
pnpm test:comprehensive:full
```

## Available Commands

### Seeding Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `pnpm test:comprehensive:seed` | Standard development seeding | Daily development work |
| `pnpm test:comprehensive:seed:minimal` | Minimal test data (5 users, 3 clients) | Quick testing, CI/CD |
| `pnpm test:comprehensive:seed:testing` | Full E2E test data (25 users, 15 clients) | End-to-end testing |
| `pnpm test:comprehensive:seed:performance` | Large dataset (100 users, 50 clients) | Performance testing |
| `pnpm test:comprehensive:clean` | Clean existing test data first | Fresh start |
| `pnpm test:comprehensive:dry-run` | Preview without making changes | Planning, debugging |

### Validation Commands

| Command | Description | Output |
|---------|-------------|---------|
| `pnpm test:comprehensive:validate` | Basic validation checks | Console summary |
| `pnpm test:comprehensive:validate:verbose` | Detailed validation output | Full details in console |
| `pnpm test:comprehensive:validate:report` | Generate HTML report with performance | data-validation-report.html |
| `pnpm test:comprehensive:full` | Complete cycle with validation | Full workflow |

## Seeding Profiles

### Minimal Profile
- **Users**: 5 (1 per role)
- **Clients**: 3
- **Payrolls**: 10
- **Historical Data**: 1 month
- **Use Case**: Quick testing, CI/CD pipelines

### Development Profile (Default)
- **Users**: 15 
- **Clients**: 10
- **Payrolls**: 50
- **Historical Data**: 6 months
- **Use Case**: Daily development work

### Testing Profile
- **Users**: 25
- **Clients**: 15
- **Payrolls**: 100
- **Historical Data**: 12 months
- **Use Case**: End-to-end testing, QA validation

### Performance Profile
- **Users**: 100
- **Clients**: 50
- **Payrolls**: 500
- **Historical Data**: 24 months
- **Use Case**: Performance testing, load testing

## What Gets Created

### 1. User Management
- **Test Users**: Realistic names with role-appropriate assignments
- **Email Pattern**: `name.surname@test.payroll.com`
- **Roles**: Complete coverage of all 5 system roles
- **Hierarchies**: Manager-consultant relationships
- **Preservation**: Existing users are NEVER modified

### 2. Client Data
- **Industries**: Technology, Healthcare, Construction, Retail, Professional Services
- **Realistic Names**: Industry-appropriate company names
- **Contact Info**: Australian phone numbers and test email addresses
- **Billing Plans**: Assigned appropriate billing plans

### 3. Payroll Operations
- **Realistic Schedules**: Weekly, fortnightly, and monthly cycles
- **Historical Data**: Past payrolls with appropriate statuses
- **Future Planning**: Draft payrolls for upcoming periods
- **Consultant Assignments**: Realistic workload distribution
- **Date Calculations**: Holiday-adjusted processing dates

### 4. User Activities
- **Leave Records**: Various leave types with realistic date ranges
- **Work Schedules**: Standard work week configurations
- **Notes**: Contextual notes for payrolls and clients
- **Time Entries**: Work hour tracking data

### 5. System Configuration
- **Reference Data**: Payroll cycles, date types, billing plans
- **Feature Flags**: Test environment markers
- **External Systems**: Test integration configurations
- **App Settings**: Test-specific configurations

## Data Safety Features

### 🔒 User Data Preservation
- **Zero Risk**: Existing user accounts are never modified
- **Backup System**: Automatic backups before any operations
- **Identification**: Test data uses distinctive patterns (@test. emails)
- **Isolation**: Test data is easily identifiable and cleanable

### 🔄 Transaction Safety
- **Rollback Capability**: Operations can be reversed
- **Dry Run Mode**: Preview changes before execution
- **Error Handling**: Graceful failure with detailed logging
- **Validation**: Integrity checks after every operation

### 📊 Data Quality Assurance
- **Referential Integrity**: All foreign keys are valid
- **Business Rules**: Data follows business logic constraints
- **Realistic Scenarios**: Data represents actual business situations
- **Performance Optimized**: Efficient data structures and relationships

## Common Workflows

### Development Setup
```bash
# Set up comprehensive test data for development
pnpm test:comprehensive:seed

# Validate everything is working
pnpm test:comprehensive:validate:verbose
```

### Testing Preparation
```bash
# Clean slate for testing
pnpm test:comprehensive:clean

# Create full test dataset
pnpm test:comprehensive:seed:testing

# Generate validation report
pnpm test:comprehensive:validate:report
```

### Performance Analysis
```bash
# Create large dataset
pnpm test:comprehensive:seed:performance

# Run performance validation
pnpm test:comprehensive:validate:report
```

### Quick Cleanup
```bash
# Remove only test data (preserves real users)
pnpm test:comprehensive:clean
```

## Troubleshooting

### Common Issues

#### Environment Setup
```bash
# Ensure environment variables are set
echo $E2E_HASURA_GRAPHQL_URL
echo $HASURA_ADMIN_SECRET

# Check Hasura connectivity
pnpm test:comprehensive:dry-run
```

#### Permission Errors
- Verify Hasura admin secret is correct
- Check network connectivity to Hasura endpoint
- Ensure admin secret has proper permissions

#### Data Conflicts
```bash
# Clean existing test data first
pnpm test:comprehensive:clean

# Try minimal profile for debugging
pnpm test:comprehensive:seed:minimal
```

#### Validation Failures
```bash
# Get detailed validation information
pnpm test:comprehensive:validate:verbose

# Generate HTML report for analysis
pnpm test:comprehensive:validate:report
```

### Debug Mode
```bash
# See what would be created without executing
pnpm test:comprehensive:dry-run

# Use minimal dataset for faster debugging
pnpm test:comprehensive:seed:minimal --dry-run
```

## File Structure

```
scripts/
├── seed-comprehensive-data.js     # Main seeding script
├── validate-comprehensive-data.js # Validation script
└── [other existing scripts]

Generated Files:
├── test-data-seed-report.json     # Detailed seeding report
├── data-validation-report.json    # Validation results
└── data-validation-report.html    # Visual validation report
```

## Integration with Development Workflow

### Pre-Development
```bash
# Ensure fresh test data
pnpm test:comprehensive:full
```

### During Development
```bash
# Quick validation after schema changes
pnpm test:comprehensive:validate
```

### Before Commits
```bash
# Validate data integrity
pnpm test:comprehensive:validate:verbose
```

### CI/CD Integration
```bash
# Minimal seeding for CI
pnpm test:comprehensive:seed:minimal

# Basic validation
pnpm test:comprehensive:validate
```

## Maintenance Schedule

### Daily
- Use `pnpm test:comprehensive:seed` for fresh development data

### Weekly
- Run `pnpm test:comprehensive:validate:report` for data quality review
- Clean and reseed with `pnpm test:comprehensive:full`

### Monthly
- Update seeding profiles based on new features
- Review and update realistic data patterns
- Performance test with `pnpm test:comprehensive:seed:performance`

### After Schema Changes
- Always run validation: `pnpm test:comprehensive:validate:verbose`
- Update seeding scripts if new tables/fields are added
- Test with dry run first: `pnpm test:comprehensive:dry-run`

## Extending the System

### Adding New Data Types
1. Update the appropriate generator class in `seed-comprehensive-data.js`
2. Add validation rules in `validate-comprehensive-data.js`
3. Test with dry run mode
4. Update this documentation

### Custom Profiles
Edit the `SEED_PROFILES` object in `scripts/seed-comprehensive-data.js`:

```javascript
const SEED_PROFILES = {
  custom: {
    users: 20,
    clients: 8,
    payrolls: 75,
    historical_months: 3,
    leave_records: 40,
    notes: 150
  }
};
```

### New Validation Rules
Add checks to the appropriate validation method in `validate-comprehensive-data.js`:

```javascript
async validateCustomRules() {
  // Add your custom validation logic
}
```

## Best Practices

### 🎯 Do
- Always use dry run mode when testing new configurations
- Run validation after seeding operations
- Use appropriate profiles for different use cases
- Keep existing user data completely untouched
- Generate reports for important validations

### ❌ Don't
- Run seeding operations in production environments
- Modify the core user preservation logic
- Skip validation after seeding
- Use performance profiles for daily development
- Ignore validation warnings

### 🔄 Regular Maintenance
- Update realistic data patterns as business evolves
- Review and optimize seeding performance
- Keep validation rules current with business logic
- Monitor data quality trends over time

## Security Considerations

- All test data uses `.test.` domains and distinctive patterns
- No real email addresses or sensitive information
- Test data is clearly marked and easily identifiable
- Existing production data is completely preserved
- All operations are logged and auditable

## Performance Expectations

### Seeding Times (Approximate)
- **Minimal**: 30 seconds
- **Development**: 2-3 minutes
- **Testing**: 5-8 minutes
- **Performance**: 15-20 minutes

### Validation Times
- **Basic**: 10-15 seconds
- **Verbose**: 30-45 seconds
- **With Report**: 1-2 minutes

These times may vary based on network latency and Hasura performance.

---

## Support and Maintenance

This comprehensive seeding system is designed to be self-maintaining and reliable. For issues or enhancements:

1. Check the troubleshooting section above
2. Review the generated validation reports
3. Use dry-run mode to debug issues
4. Examine the detailed seeding reports

The system prioritizes data safety above all else - existing user data will never be modified or lost during any seeding operation.