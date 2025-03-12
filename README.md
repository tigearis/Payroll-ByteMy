# Getting Started

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

SQL Dump

PGPASSWORD="npg_WavFRZ1lEx4U" pg_dump -s -U neondb_owner -h ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech neondb > schema.sql
PGPASSWORD="npg_WavFRZ1lEx4U" pg_dump -U neondb_owner -d neondb -h ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech -t table1,table2 -f dump.sql

Payroll Cycles and Processing Rules

This document outlines payroll cycles and the rules governing processing dates and business day adjustments.

1. Weekly Payroll

Frequency: Weekly
Timing: Specific day of the week (e.g., Friday)
Date Type: Day of Week (DOW)
Date Value: 1 = Sunday, 2 = Monday, ..., 7 = Saturday
Business Day Rule: Previous Business Day
2. Fortnightly Payroll

Frequency: Fortnightly
Timing: Specific day of the week
Week Assignment: Week A (first week of January) or Week B (second week of January)
Date Type: Week A or Week B
Date Value: 1 = Sunday, 2 = Monday, ..., 7 = Saturday
Business Day Rule: Previous Business Day
3. Bi-Monthly Payroll

Frequency: Twice per month
Date Types:
Start of Month (SOM): 1st and 15th of the month; Next Business Day rule.
End of Month (EOM): 30th and 15th of the month; Previous Business Day rule.
February Exception: For both SOM and EOM, use the 14th instead of the 15th.
4. Monthly Payroll

Frequency: Monthly
Date Types:
Start of Month (SOM): Next Business Day rule.
End of Month (EOM) or Fixed Date: Previous Business Day rule.
Date Value: (Only used with Fixed Date) 1 = Sunday, 2 = Monday, ..., 7 = Saturday
5. Quarterly Payroll

Frequency: Quarterly (March, June, September, December)
Rules: Same as Monthly Payroll
Key Terms

DOW (Day of Week): Specific day of the week.
SOM (Start of Month): First day of the month.
EOM (End of Month): Last day of the month.
Fixed Date: Predetermined date in the month.
Previous Business Day: The business day before the scheduled date.
Next Business Day: The business day after the scheduled date.
EFT Processing Rules

1. Processing Lead Time

processing_days_before_eft is a value used to determine how many day before the Eft Date processing is done.
If the processing date falls on a weekend or public holiday, adjust to the Previous Business Day.
2. EFT Date Adjustment

If the EFT date is changed, the payroll processing date must be recalculated to maintain the required lead time.
Key Terms

EFT (Electronic Funds Transfer): Electronic transfer of employee wages.
processing_days_before_eft: Time between payroll processing and the EFT date.

Let me summarize the key points to ensure I understand correctly:
Key Principles:

Each payroll cycle has specific date calculation rules
Day of week (DOW) is represented as 1-7 (Sunday-Saturday)
Business day adjustments vary by cycle type
Different date types (DOW, SOM, EOM, Fixed Date) have unique handling

Specific Rules Breakdown:

Weekly

Always DOW type
DOW value 1-7
Always use Previous Business Day rule

Fortnightly

DOW type only
Supports Week A (first week of Jan) and Week B (second week of Jan)
DOW value 1-7
Always use Previous Business Day rule

Bi-Monthly

SOM: 1st and 15th, use Next Business Day
EOM: 30th and 15th, use Previous Business Day
February special case: use 14th
No Date Value needed

Monthly

Supports Fixed Date, EOM, SOM
SOM: Next Business Day
EOM and Fixed Date: Previous Business Day
Fixed Date uses a day of month as Date Value

Quarterly

Same as Monthly
Only on months 3, 6, 9, 12

curl -X POST "<http://localhost:3000/api/holidays/sync>" \
     -H "Authorization: Bearer sk_test_Vmcx7vTwGJWmXtwVc5hWUxKGIF7BiwA2GevfPUNCVv" \
     -H "x-hasura-admin-secret: KIATiwETsv3yBwN7e73W2kJwA0t5hf6UK94HDkPZrIQAtpLmK8fCPYE9bIc0Sd8B"
     -H "X-Hasura-Role: admin" \
     -H "Content-Type: application/json" \
     -d '{"year": 2025, "countryCode": "AU"}'
