# 🏢 Payroll Management System

A comprehensive payroll management solution built with Next.js, featuring role-based access control, staff management, and seamless authentication integration.

## 📚 Documentation

**📖 [Complete Documentation Hub](./docs/README.md)** - Start here for all user guides, technical documentation, and system information.

### Quick Links

- **[Staff Management User Guide](./docs/USER_DOCUMENTATION_STAFF_MANAGEMENT.md)** - Complete guide for managing staff members
- **[System Architecture](./COMPLETE_SYSTEM_ARCHITECTURE.md)** - Technical architecture overview
- **[Role Sync Implementation](./ROLE_SYNC_IMPLEMENTATION.md)** - Role synchronization details

---

## 🚀 Getting Started

### Development Setup

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Authentication Testing

Test Hasura token generation:

```javascript
Clerk.session
  .getToken({ template: "hasura" })
  .then((token) => console.log("Hasura Token:", token));
```

---

## 💼 System Features

### ✅ Staff Management System (Complete)

- Complete CRUD operations for staff members
- Role-based access control (5 distinct roles)
- Real-time statistics dashboard
- Advanced filtering and search capabilities
- Modal-based editing interface
- Soft deletion with audit trails
- Clerk authentication integration

### 🔄 Coming Soon

- Payroll Processing System
- Client Management
- Leave Management
- Reporting & Analytics

---

## 🗃️ Database Operations

### SQL Dump Commands

Schema only:

```bash
PGPASSWORD="npg_WavFRZ1lEx4U" pg_dump -s -U neondb_owner -h ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech neondb > schema.sql
```

Specific tables:

```bash
PGPASSWORD="npg_WavFRZ1lEx4U" pg_dump -U neondb_owner -d neondb -h ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech -t table1,table2 -f dump.sql
```

---

## 📅 Payroll Processing Rules

### Supported Payroll Cycles

1. **Weekly Payroll**

   - Frequency: Weekly
   - Timing: Specific day of the week (e.g., Friday)
   - Date Type: Day of Week (DOW)
   - Date Value: 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday
   - Business Day Rule: Previous Business Day

2. **Fortnightly Payroll**

   - Frequency: Fortnightly
   - Timing: Specific day of the week
   - Week Assignment: Week A (first week of January) or Week B (second week of January)
   - Date Type: Week A or Week B
   - Date Value: 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday
   - Business Day Rule: Previous Business Day

3. **Bi-Monthly Payroll**

   - Frequency: Twice per month
   - Date Types:
     - Start of Month (SOM): 1st and 15th of the month; Next Business Day rule
     - End of Month (EOM): 30th and 15th of the month; Previous Business Day rule
   - February Exception: For both SOM and EOM, use the 14th instead of the 15th

4. **Monthly Payroll**

   - Frequency: Monthly
   - Date Types:
     - Start of Month (SOM): Next Business Day rule
     - End of Month (EOM) or Fixed Date: Previous Business Day rule
   - Date Value: (Only used with Fixed Date) Day of month (1-31)

5. **Quarterly Payroll**
   - Frequency: Quarterly (March, June, September, December)
   - Rules: Same as Monthly Payroll

### Key Terms

- **DOW (Day of Week)**: Specific day of the week
- **SOM (Start of Month)**: First day of the month
- **EOM (End of Month)**: Last day of the month
- **Fixed Date**: Predetermined date in the month
- **Previous Business Day**: The business day before the scheduled date
- **Next Business Day**: The business day after the scheduled date

### EFT Processing Rules

1. **Processing Lead Time**

   - `processing_days_before_eft` determines how many days before the EFT Date processing is done
   - If the processing date falls on a weekend or public holiday, adjust to the Previous Business Day

2. **EFT Date Adjustment**
   - If the EFT date is changed, the payroll processing date must be recalculated to maintain the required lead time

### Key Terms

- **EFT (Electronic Funds Transfer)**: Electronic transfer of employee wages
- **processing_days_before_eft**: Time between payroll processing and the EFT date

---

## 🏖️ Holiday Sync API

Sync public holidays for payroll processing:

```bash
curl -X POST "http://localhost:3000/api/holidays/sync" \
     -H "Authorization: Bearer sk_test_Vmcx7vTwGJWmXtwVc5hWUxKGIF7BiwA2GevfPUNCVv" \
     -H "x-hasura-admin-secret: KIATiwETsv3yBwN7e73W2kJwA0t5hf6UK94HDkPZrIQAtpLmK8fCPYE9bIc0Sd8B" \
     -H "X-Hasura-Role: admin" \
     -H "Content-Type: application/json" \
     -d '{"year": 2025, "countryCode": "AU"}'
```

---

## 🔧 Technical Stack

- **Frontend**: Next.js 14 with TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL via Neon
- **GraphQL**: Hasura GraphQL Engine
- **Authentication**: Clerk with JWT integration
- **State Management**: Apollo Client
- **Package Manager**: pnpm

---

## 📞 Support

For help and support:

1. **📖 Check Documentation**: Start with the [Documentation Hub](./docs/README.md)
2. **🔍 Search FAQ**: Review [Staff Management FAQ](./docs/USER_DOCUMENTATION_STAFF_MANAGEMENT.md#frequently-asked-questions)
3. **🛠️ Troubleshooting**: Use the [Troubleshooting Guide](./docs/USER_DOCUMENTATION_STAFF_MANAGEMENT.md#troubleshooting)
4. **💬 Contact Support**: Reach out through your organization's support channels

---

_Last Updated: January 2025_
