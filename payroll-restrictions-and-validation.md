# Payroll Date Types & Cycle Types: Enhanced System Documentation

## Overview

This document outlines the database constraints, business logic restrictions, validation rules, and enhanced date generation functionality for payroll cycles and date types in the payroll system.

**Latest Enhancements**:

- ✅ **Enhanced Adjustment Notes**: Detailed explanations for every date adjustment
- ✅ **Holiday Integration**: Specific holiday names in adjustment reasons
- ✅ **Weekend Detection**: Clear Saturday/Sunday adjustment explanations
- ✅ **Bulk Regeneration**: Smart function to regenerate all payroll dates
- ✅ **Comprehensive Reporting**: Detailed statistics on adjustments

## Table Structure

### Payroll Cycles (`payroll_cycles`)

**Enum Values**: `payroll_cycle_type`

- `weekly`
- `fortnightly`
- `bi_monthly`
- `monthly`
- `quarterly`

**Constraints**:

- `name` must be unique
- Referenced by `payrolls.cycle_id` with `ON DELETE RESTRICT`

### Payroll Date Types (`payroll_date_types`)

**Enum Values**: `payroll_date_type`

- `fixed_date` - Specific day of month (1-31)
- `eom` - End of Month (automatic)
- `som` - Start of Month (automatic)
- `week_a` - Fortnightly Week A with day of week
- `week_b` - Fortnightly Week B with day of week
- `dow` - Day of Week (1-7, where 1=Monday)

**Constraints**:

- `name` must be unique
- Referenced by `payrolls.date_type_id` with `ON DELETE RESTRICT`

### Payroll Dates (`payroll_dates`)

Generated dates with comprehensive adjustment tracking:

| **Column**          | **Type**    | **Description**                               |
| ------------------- | ----------- | --------------------------------------------- |
| `id`                | `uuid`      | Primary key                                   |
| `payroll_id`        | `uuid`      | Foreign key to payrolls                       |
| `original_eft_date` | `date`      | Original calculated date (before adjustment)  |
| `adjusted_eft_date` | `date`      | Final business day adjusted date              |
| `processing_date`   | `date`      | Date when payroll processing should begin     |
| `notes`             | `text`      | **Enhanced**: Detailed adjustment explanation |
| `created_at`        | `timestamp` | Record creation time                          |
| `updated_at`        | `timestamp` | Last modification time                        |

## Enhanced Date Generation System

### Core Functions

#### 1. `generate_payroll_dates()` - Enhanced

```sql
SELECT * FROM generate_payroll_dates(
  payroll_id,          -- UUID of payroll
  start_date,          -- Start date (default: current date)
  end_date,            -- End date (default: +1 year)
  max_dates            -- Maximum dates to generate (default: 52)
);
```

**Key Features**:

- ✅ **Smart Original Date Logic**: Keeps configured dates (25th, 26th, etc.) as original
- ✅ **Separate Adjustment Logic**: Only adjusts for business days, preserves original intent
- ✅ **Detailed Notes**: Explains every adjustment with specific reasons

#### 2. `adjust_date_with_reason()` - New Helper Function

```sql
SELECT * FROM adjust_date_with_reason(
  target_date,         -- Date to check/adjust
  adjustment_rule      -- 'previous', 'next', or 'nearest'
);
```

**Returns**:

- `adjusted_date`: Final business day
- `adjustment_reason`: Detailed explanation text

#### 3. `regenerate_all_payroll_dates()` - New Bulk Function

```sql
SELECT * FROM regenerate_all_payroll_dates(
  start_date,          -- Default: '2024-01-01'
  end_date,            -- Default: '2026-12-31'
  max_dates_per_payroll, -- Default: 52
  delete_existing      -- Default: true (overwrites existing)
);
```

**Returns Summary**:

- `payroll_id`: UUID of each payroll
- `payroll_name`: Human-readable name
- `dates_generated`: Count of dates created
- `dates_with_adjustments`: Count requiring adjustment

## Business Logic Restrictions

### Adjustment Rules (`adjustment_rules`)

The `adjustment_rules` table acts as a **whitelist** defining valid cycle + date type combinations and their business day adjustment logic:

| **Cycle**     | **Valid Date Types**       | **Adjustment Rule**       | **Rule Code**       |
| ------------- | -------------------------- | ------------------------- | ------------------- |
| `weekly`      | `dow` only                 | Previous Business Day     | `previous`          |
| `fortnightly` | `week_a`, `week_b` only    | Previous Business Day     | `previous`          |
| `bi_monthly`  | `som`, `eom` only          | SOM→Next, EOM→Previous    | `next` / `previous` |
| `monthly`     | `som`, `eom`, `fixed_date` | SOM→Next, Others→Previous | `next` / `previous` |
| `quarterly`   | `som`, `eom`, `fixed_date` | SOM→Next, Others→Previous | `next` / `previous` |

### Invalid Combinations

Any cycle + date type combination **not** in the adjustment_rules table is considered invalid:

❌ **Not Allowed**:

- `weekly` + `som`, `eom`, `fixed_date`, `week_a`, `week_b`
- `fortnightly` + `som`, `eom`, `fixed_date`, `dow`
- `bi_monthly` + `fixed_date`, `dow`, `week_a`, `week_b`

## Date Value Logic

The `date_value` column in the `payrolls` table should follow these rules:

### Required Date Values

| **Date Type** | **Date Value** | **Range** | **Description**                  |
| ------------- | -------------- | --------- | -------------------------------- |
| `fixed_date`  | **Required**   | `1-31`    | Specific day of month            |
| `dow`         | **Required**   | `1-7`     | Day of week (1=Monday, 7=Sunday) |
| `week_a`      | **Required**   | `1-7`     | Day of week for Week A           |
| `week_b`      | **Required**   | `1-7`     | Day of week for Week B           |

### No Date Value Required

| **Date Type** | **Date Value** | **Logic**                            |
| ------------- | -------------- | ------------------------------------ |
| `som`         | **NULL**       | Automatically uses 1st of month      |
| `eom`         | **NULL**       | Automatically uses last day of month |

## Enhanced Adjustment Notes System

### Note Format Examples

The system now provides detailed explanations for every date adjustment:

#### Holiday Adjustments

```
"Adjusted from ANZAC Day (Thursday 25 Apr 2024) to previous business day (Wednesday 24 Apr 2024)"
"Adjusted from Christmas Day (Wednesday 25 Dec 2024) to previous business day (Tuesday 24 Dec 2024)"
"Adjusted from Good Friday (Friday 29 Mar 2024) to previous business day (Thursday 28 Mar 2024)"
```

#### Weekend Adjustments

```
"Adjusted from Sunday (25 Feb 2024) to previous business day (Friday 23 Feb 2024)"
"Adjusted from Saturday (25 May 2024) to previous business day (Friday 24 May 2024)"
```

#### No Adjustment Required

```
notes = NULL  -- When original date is already a business day
```

### Supported Australian Holidays

The system recognizes and names these holidays in adjustment notes:

- New Year's Day
- Australia Day
- Good Friday
- Easter Monday
- ANZAC Day
- Queen's Birthday
- Christmas Day
- Boxing Day

## Current System Statistics

**Latest Generation Results** (636 total dates):

- **Dates requiring adjustment**: 225 (35%)
- **Saturday adjustments**: 150 (most common)
- **Sunday adjustments**: 51
- **Holiday adjustments**: 4 (ANZAC Day, Christmas Day)

### Current Payroll Distribution

```sql
-- Example valid combinations in use:
weekly      + dow        (2 payrolls) - 1 adjustment
fortnightly + week_a     (2 payrolls) - 3 adjustments
fortnightly + week_b     (2 payrolls) - 53 adjustments
bi_monthly  + som        (2 payrolls) - 20 adjustments
bi_monthly  + eom        (1 payroll)  - 11 adjustments
monthly     + som        (1 payroll)  - 16 adjustments
monthly     + eom        (1 payroll)  - 11 adjustments
monthly     + fixed_date (3 payrolls) - 42 adjustments
quarterly   + som        (1 payroll)  - 7 adjustments
quarterly   + eom        (1 payroll)  - 2 adjustments
quarterly   + fixed_date (1 payroll)  - 7 adjustments
```

## Validation Rules

### Database Level

1. **Enum Constraints**: Only valid cycle and date type values allowed
2. **Unique Constraints**: Cycle and date type names must be unique
3. **Foreign Key Constraints**: Payrolls must reference valid cycles and date types
4. **Check Constraints**:
   - `processing_days_before_eft >= 0`
   - `processing_time >= 0`
   - `employee_count >= 0` (if not null)

### Application Level Recommendations

1. **Combination Validation**: Validate that cycle + date type exists in `adjustment_rules`
2. **Date Value Validation**:

   ```sql
   -- Ensure som/eom have NULL date_value
   CHECK (
     (date_type IN ('som', 'eom') AND date_value IS NULL) OR
     (date_type NOT IN ('som', 'eom') AND date_value IS NOT NULL)
   )

   -- Ensure date_value ranges are valid
   CHECK (
     (date_type = 'fixed_date' AND date_value BETWEEN 1 AND 31) OR
     (date_type IN ('dow', 'week_a', 'week_b') AND date_value BETWEEN 1 AND 7) OR
     (date_type IN ('som', 'eom') AND date_value IS NULL)
   )
   ```

## Business Day Adjustment Logic

### Adjustment Rules by Type

- **Start of Month (SOM)**: Moves to **next** business day if falls on weekend/holiday
- **End of Month (EOM)**: Moves to **previous** business day if falls on weekend/holiday
- **Fixed Date**: Moves to **previous** business day if falls on weekend/holiday
- **Day of Week**: Moves to **previous** business day if falls on weekend/holiday

### Holiday Integration

The system uses the `holidays` table to identify non-business days:

- Business days = Monday-Friday excluding holidays
- Weekends (Saturday/Sunday) are automatically non-business days
- Australian public holidays are stored in `holidays` table
- **Enhanced**: Holiday names are included in adjustment notes

### Date Preservation Logic

**Key Enhancement**: The system now preserves the **original intended date** while separately tracking the **business day adjusted date**:

- `original_eft_date`: Always shows the configured date (e.g., 25th, 26th, SOM, EOM)
- `adjusted_eft_date`: Shows the actual business day the payment will process
- `notes`: Explains why and how the adjustment was made

## SQL Examples

### Enhanced Date Generation

```sql
-- Generate dates for a specific payroll with detailed notes
SELECT
  TO_CHAR(original_eft_date, 'YYYY-MM-DD Day') as intended_date,
  TO_CHAR(adjusted_eft_date, 'YYYY-MM-DD Day') as actual_date,
  notes as adjustment_reason
FROM generate_payroll_dates(
  'f45e433b-fce5-4c95-bf24-364c66792709'::uuid, -- Monthly 25th payroll
  '2024-01-01'::date,
  '2024-12-31'::date
)
WHERE notes IS NOT NULL
ORDER BY original_eft_date;
```

### Bulk Regeneration with Reporting

```sql
-- Regenerate all payroll dates and get summary
SELECT
  payroll_name,
  dates_generated,
  dates_with_adjustments,
  ROUND(dates_with_adjustments::numeric / dates_generated * 100, 1) as adjustment_percentage
FROM regenerate_all_payroll_dates('2024-01-01', '2026-12-31')
ORDER BY adjustment_percentage DESC;
```

### Analysis Queries

```sql
-- Holiday adjustment analysis
SELECT
  EXTRACT(YEAR FROM original_eft_date) as year,
  COUNT(*) as total_adjustments,
  COUNT(CASE WHEN notes LIKE '%ANZAC%' THEN 1 END) as anzac_adjustments,
  COUNT(CASE WHEN notes LIKE '%Christmas%' THEN 1 END) as christmas_adjustments,
  COUNT(CASE WHEN notes LIKE '%Sunday%' THEN 1 END) as sunday_adjustments,
  COUNT(CASE WHEN notes LIKE '%Saturday%' THEN 1 END) as saturday_adjustments
FROM payroll_dates
WHERE notes IS NOT NULL
GROUP BY EXTRACT(YEAR FROM original_eft_date)
ORDER BY year;
```

### Valid Payroll Creation

```sql
-- Weekly payroll on Friday
INSERT INTO payrolls (cycle_id, date_type_id, date_value, name, ...)
VALUES (
  (SELECT id FROM payroll_cycles WHERE name = 'weekly'),
  (SELECT id FROM payroll_date_types WHERE name = 'dow'),
  6, -- Friday
  'Weekly Payroll - Friday',
  ...
);

-- Monthly SOM payroll
INSERT INTO payrolls (cycle_id, date_type_id, date_value, name, ...)
VALUES (
  (SELECT id FROM payroll_cycles WHERE name = 'monthly'),
  (SELECT id FROM payroll_date_types WHERE name = 'som'),
  NULL, -- Auto-calculates to 1st
  'Monthly Payroll - SOM',
  ...
);
```

### Validation Query

```sql
-- Check for invalid combinations
SELECT p.name, pc.name as cycle, pdt.name as date_type
FROM payrolls p
JOIN payroll_cycles pc ON p.cycle_id = pc.id
JOIN payroll_date_types pdt ON p.date_type_id = pdt.id
LEFT JOIN adjustment_rules ar ON ar.cycle_id = pc.id AND ar.date_type_id = pdt.id
WHERE ar.id IS NULL;
```

## Usage Patterns & Best Practices

### Recommended Workflow

1. **Create Payroll**: Ensure valid cycle + date type combination
2. **Generate Initial Dates**: Use `generate_payroll_dates()` for new payrolls
3. **Bulk Regeneration**: Use `regenerate_all_payroll_dates()` for system-wide updates
4. **Monitor Adjustments**: Review adjustment statistics and notes for business insight

### Performance Considerations

- **Batch Processing**: `regenerate_all_payroll_dates()` processes all payrolls efficiently
- **Date Range Optimization**: Limit date ranges to avoid excessive data generation
- **Index Usage**: Ensure proper indexing on `payroll_dates.payroll_id` and date columns

### Error Handling

The enhanced functions include comprehensive error handling:

- Invalid payroll IDs raise descriptive exceptions
- Date calculation errors are handled gracefully
- Transaction rollback on critical failures

## Future Enhancements

1. **Additional Holiday Support**: Expand holiday detection for other countries
2. **Custom Adjustment Rules**: Allow per-payroll override of adjustment logic
3. **Notification Integration**: Alert users when significant date adjustments occur
4. **GraphQL Schema Updates**: Expose enhanced functionality in API
5. **UI Enhancements**: Display adjustment reasoning in frontend interfaces
6. **Audit Trail**: Track when and why payroll dates were regenerated

---

_Last Updated: Enhanced with detailed adjustment notes and bulk regeneration functionality_
