# Comprehensive GraphQL Testing Suite

This directory contains a comprehensive GraphQL testing system that validates all aspects of your GraphQL operations to ensure the UI will work correctly with proper data retrieval and mutations.

## 🚀 Quick Start

```bash
# Run all GraphQL tests
pnpm test:graphql:comprehensive

# Run quick validation tests
pnpm test:graphql:quick

# Run specific test suites
pnpm test:graphql:operations     # Operation discovery and validation
pnpm test:graphql:permissions    # Permission boundary testing
pnpm test:graphql:ui            # UI integration testing
pnpm test:graphql:performance   # Performance benchmarking
pnpm test:graphql:workflows     # End-to-end workflows
```

## 📋 Test Suites Overview

### 1. Domain Operations Testing (`domain-operations.test.ts`)
**Purpose**: Automatically discovers and validates all GraphQL operations across 11 domains

**Features**:
- ✅ Discovers all 47+ GraphQL files automatically
- ✅ Validates syntax and schema compliance
- ✅ Tests domain-specific functionality
- ✅ Validates naming conventions
- ✅ Checks security classifications
- ✅ Analyzes fragment usage

**Domains Tested**: `auth`, `audit`, `billing`, `clients`, `email`, `external-systems`, `leave`, `notes`, `payrolls`, `users`, `work-schedule`

### 2. Permission Boundary Testing (`permission-boundaries.test.ts`)
**Purpose**: Ensures proper access control across all user roles

**Features**:
- 🔐 Tests all 5 user roles: `developer`, `org_admin`, `manager`, `consultant`, `viewer`
- 🔐 Validates hierarchical permission system
- 🔐 Tests critical/high/medium security classifications
- 🔐 Ensures proper permission enforcement
- 🔐 Tests cross-domain data access

**Security Levels**:
- **CRITICAL**: Auth, audit, permissions (admin + MFA required)
- **HIGH**: PII, client data, employee info (role-based access)
- **MEDIUM**: Internal business data (authentication required)

### 3. UI Integration Testing (`ui-integration.test.ts`)
**Purpose**: Validates integration between UI components and GraphQL operations

**Features**:
- 🔗 Maps components to their GraphQL operations
- 🔗 Tests Apollo Client hook usage
- 🔗 Validates operation execution with UI data structures
- 🔗 Tests real-time subscription integration
- 🔗 Ensures proper loading/error state handling

**Component Analysis**:
- Discovers GraphQL usage in TSX files
- Maps operations to components
- Validates Apollo Client patterns
- Tests mutation data structures

### 4. Enhanced Performance Testing (`enhanced-performance.test.ts`)
**Purpose**: Comprehensive performance analysis and benchmarking

**Features**:
- ⚡ Tests all operations for performance thresholds
- ⚡ Analyzes query complexity scores
- ⚡ Measures execution times across roles
- ⚡ Load testing with concurrent requests
- ⚡ Memory usage monitoring
- ⚡ Performance regression detection

**Thresholds**:
- Queries: < 30 seconds
- Mutations: < 15 seconds
- Complexity: < 500 score
- Critical operations: < 5 seconds

### 5. Data Integrity Testing (`data-integrity.test.ts`)
**Purpose**: Validates mutations and data consistency

**Features**:
- 🔄 Tests create/update/delete operations
- 🔄 Validates referential integrity
- 🔄 Tests business rule enforcement
- 🔄 Handles concurrent mutation scenarios
- 🔄 Tests transaction rollback scenarios
- 🔄 Validates audit trail creation

**Data Validation**:
- Entity relationship integrity
- Business rule compliance
- Race condition handling
- Cross-domain consistency

### 6. End-to-End Workflow Testing (`end-to-end-workflows.test.ts`)
**Purpose**: Tests complete business workflows

**Features**:
- 🔄 User management lifecycle
- 🔄 Client onboarding workflow
- 🔄 Payroll processing workflow
- 🔄 Audit and compliance workflow
- 🔄 Error handling and recovery

**Workflows Tested**:
1. **User Management**: Create → Assign → Update → Deactivate
2. **Client Onboarding**: Create Client → Setup Payroll → Assign Consultant → Create Notes
3. **Payroll Processing**: Create Dates → Assign Staff → Update Status → Generate Reports
4. **Audit & Compliance**: User Actions → Data Changes → Compliance Reporting

### 7. Schema Validation Testing (`schema-validation.test.ts`)
**Purpose**: Validates GraphQL schema structure and operation compliance

**Features**:
- ✅ Schema syntax validation
- ✅ Operation-schema compatibility
- ✅ Fragment dependency analysis
- ✅ Naming convention enforcement

## 🛠️ Test Utilities

### Core Utilities (`utils/test-utilities.ts`)
- **GraphQLOperationDiscovery**: Automatically finds all GraphQL operations
- **TestDataGenerators**: Creates realistic test data for all domains
- **AuthenticationHelper**: Manages multi-role authentication
- **PerformanceTestUtils**: Analyzes query complexity and performance

### Authentication Testing (`utils/auth-testing.ts`)
- **GraphQLTestClient**: Executes operations with different user roles
- **PermissionTester**: Tests permission boundaries systematically
- **TestDataManager**: Sets up and cleans test data

### Data Seeding (`utils/data-seeding.ts`)
- **ComprehensiveTestDataManager**: Creates complete test environments
- **Domain-specific test data**: Realistic data for all business domains
- **Relationship management**: Maintains data integrity during testing

## 📊 Test Configuration

### Jest Configuration (`jest.graphql.config.js`)
Enhanced configuration supporting:
- ⚙️ Comprehensive test categorization
- ⚙️ Performance optimization (parallel execution)
- ⚙️ Enhanced reporting (JUnit XML, HTML reports)
- ⚙️ Memory monitoring and management
- ⚙️ Selective test execution

### Environment Setup (`test-env-setup.js`)
- 🔧 Test environment configuration
- 🔧 Performance threshold definitions
- 🔧 Logging and monitoring setup
- 🔧 Memory usage tracking

## 🎯 Running Tests

### Development Workflow
```bash
# Quick validation during development
pnpm test:graphql:quick

# Watch mode for active development
pnpm test:graphql:watch

# Test specific functionality
pnpm test:graphql:operations    # Operation discovery
pnpm test:graphql:permissions   # Permission testing
pnpm test:graphql:ui           # UI integration
```

### Pre-Deployment Testing
```bash
# Full comprehensive test suite
pnpm test:graphql:full

# Performance benchmarking
pnpm test:graphql:enhanced-performance

# Data integrity validation
pnpm test:graphql:integrity

# End-to-end workflows
pnpm test:graphql:workflows
```

### CI/CD Pipeline
```bash
# Optimized for CI environments
pnpm test:graphql:ci

# With coverage reporting
pnpm test:graphql:coverage
```

## 📈 Test Reports

### Generated Reports
1. **JUnit XML**: `__tests__/reports/graphql-comprehensive-results.xml`
2. **HTML Report**: `__tests__/reports/graphql-test-report.html`
3. **Coverage Report**: `__tests__/coverage/`

### Performance Baselines
Tests establish performance baselines by domain:
- Average execution times
- Complexity scores
- Success rates
- Memory usage patterns

## 🔧 Configuration

### Environment Variables
```bash
# Required for testing
NEXT_PUBLIC_HASURA_GRAPHQL_URL=your_hasura_endpoint
HASURA_GRAPHQL_ADMIN_SECRET=your_admin_secret

# Optional testing configuration
SKIP_SLOW_TESTS=true              # Skip performance-intensive tests
SKIP_PERFORMANCE_TESTS=true      # Skip performance benchmarking
VERBOSE_TESTING=true              # Enable detailed logging
MONITOR_MEMORY=true               # Enable memory monitoring
```

### Test User Configuration
The system uses predefined test users for each role:
- **Developer**: Full system access
- **Org Admin**: Administrative operations
- **Manager**: Team and client management
- **Consultant**: Assigned payroll access
- **Viewer**: Read-only access

## 🚨 Troubleshooting

### Common Issues

1. **Connection Errors**
   ```bash
   # Verify Hasura connection
   curl -X POST $NEXT_PUBLIC_HASURA_GRAPHQL_URL \
     -H "x-hasura-admin-secret: $HASURA_GRAPHQL_ADMIN_SECRET" \
     -d '{"query": "{ __schema { types { name } } }"}'
   ```

2. **Permission Errors**
   ```bash
   # Check test user setup
   pnpm test:users:list
   
   # Recreate test users if needed
   pnpm test:users:recreate
   ```

3. **Performance Issues**
   ```bash
   # Skip slow tests during development
   SKIP_SLOW_TESTS=true pnpm test:graphql:quick
   ```

4. **Memory Issues**
   ```bash
   # Monitor memory usage
   MONITOR_MEMORY=true pnpm test:graphql:comprehensive
   ```

### Test Data Management
```bash
# Set up comprehensive test environment
node -e "require('./__tests__/graphql/utils/data-seeding.js').testDataManager.setupCompleteTestEnvironment()"

# Clean up test data
node -e "require('./__tests__/graphql/utils/data-seeding.js').testDataManager.cleanupAllTestData()"
```

## 🎯 Success Criteria

The comprehensive test suite ensures:

1. **100% Operation Coverage**: All GraphQL operations are discovered and tested
2. **Permission Compliance**: SOC2-compliant access control validation
3. **UI Compatibility**: All UI components can execute their required operations
4. **Performance Standards**: Operations meet established performance thresholds
5. **Data Integrity**: Mutations maintain consistency and business rules
6. **Workflow Validation**: End-to-end business processes work correctly

## 📚 Best Practices

### For Developers
1. Run `pnpm test:graphql:quick` before committing
2. Use specific test suites during development
3. Monitor performance impact of new operations
4. Ensure new operations follow naming conventions

### For DevOps
1. Include `pnpm test:graphql:ci` in CI/CD pipelines
2. Monitor test performance trends
3. Set up automated test reporting
4. Configure proper environment variables

### For Security
1. Run permission tests after role changes
2. Validate audit logging with `test:graphql:workflows`
3. Test critical operations with `test:graphql:operations`
4. Monitor access patterns in test reports

This comprehensive testing system ensures your GraphQL operations are reliable, secure, performant, and ready for production use.