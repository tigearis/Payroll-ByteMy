# Cross-Domain Reporting Tool

## Overview

The Cross-Domain Reporting Tool allows users to generate custom reports by selecting fields from multiple domains (clients, payrolls, payroll dates, billing) and downloading the results as CSV files. This tool provides flexible, dynamic reporting capabilities across the entire system.

## Features

### 🔍 **Multi-Domain Support**

- **Clients**: Client information, contact details, status
- **Payrolls**: Payroll configurations, processing details, status
- **Payroll Dates**: Scheduled payroll dates and status
- **Billing**: Invoice amounts, dates, payment status
- **Users**: User profiles, roles, contact information, status
- **User Skills**: Individual user skills and proficiency levels
- **User Roles**: Role assignments and permissions
- **Roles**: System roles and their definitions
- **Payroll Required Skills**: Skills required for specific payrolls
- **Work Schedule**: User work schedules and capacity
- **Leave**: Leave records and time off tracking
- **Notes**: System notes and comments
- **User Invitations**: Invitation management and status
- **Permission Audit Logs**: Security audit trails
- **Permission Overrides**: Custom permission exceptions
- **Resources**: System resources and permissions
- **Role Permissions**: Role-based permission assignments

### 🎯 **Flexible Field Selection**

- Choose specific fields from each domain
- Select all or none with quick toggle buttons
- Visual indicators showing selected field counts
- Automatic relationship handling between domains

### 🔗 **Cross-Domain Relationships**

- **Clients → Payrolls**: View all payrolls for each client
- **Payrolls → Payroll Dates**: See scheduled dates for each payroll
- **Payrolls → Billing**: Access billing records for payrolls
- **Automatic Joins**: System handles complex relationships automatically

### 📊 **Advanced Options**

- **Sorting**: Sort by any field in ascending or descending order
- **Limiting**: Set record limits (1-10,000 records)
- **Relationships**: Toggle inclusion of related data
- **Real-time Preview**: See results before downloading

### 💾 **Export Capabilities**

- **CSV Download**: Standard CSV format with proper escaping
- **Preview Table**: View first 10 records in browser
- **Full Data Export**: Download complete dataset
- **Automatic Naming**: Reports named with current date

## Usage Guide

### 1. Accessing the Tool

- Navigate to `/reports` in the dashboard
- Requires Manager, Admin, or Developer role
- Tool loads available fields and relationships automatically

### 2. Configuring Your Report

#### Select Domains

- Check the domains you want to include in your report
- Primary domain determines the main query structure
- Related domains are automatically joined based on relationships

#### Choose Fields

- Select specific fields from each domain
- Use "All" or "None" buttons for quick selection
- Field counts are shown next to each domain

#### Set Options

- **Include Related Data**: Toggle cross-domain relationships
- **Record Limit**: Set maximum number of records (default: 100)
- **Sort By**: Choose field and sort order
- **Filters**: Apply specific criteria (coming soon)

### 3. Generating Reports

- Click "Generate Report" to execute the query
- View results in the preview table
- Download full dataset as CSV
- Reports are cached for quick re-download

## Example Report Scenarios

### User Skills Analysis Report

```
Domains: Users, User Skills
Fields:
- Users: name, email, role, isActive
- User Skills: skillName, proficiencyLevel
Result: Complete skills inventory with user details
```

### Role and Permission Report

```
Domains: Users, User Roles, Roles, Role Permissions
Fields:
- Users: name, email, isActive
- User Roles: (relationship data)
- Roles: name, displayName, priority
- Role Permissions: (permission assignments)
Result: Complete role hierarchy and permission mapping
```

### Client Summary Report

```
Domains: Clients, Payrolls
Fields:
- Clients: name, contact_person, active
- Payrolls: name, status, employee_count
Result: Each client with their payroll count and details
```

### Payroll Performance Report

```
Domains: Payrolls, Payroll Dates, Billing, Payroll Required Skills
Fields:
- Payrolls: name, status, processing_time
- Payroll Dates: date, status
- Billing: amount, invoice_date
- Payroll Required Skills: skillName, requiredLevel
Result: Payroll performance with scheduled dates, billing, and required skills
```

### Work Schedule Analysis Report

```
Domains: Users, Work Schedule, Leave
Fields:
- Users: name, role, isActive
- Work Schedule: workDay, workHours, adminTimeHours, payrollCapacityHours
- Leave: leaveType, startDate, endDate, status
Result: Complete workforce capacity and availability analysis
```

### Billing Analysis Report

```
Domains: Billing, Payrolls, Clients
Fields:
- Billing: amount, invoice_date, status
- Payrolls: name, status
- Clients: name, contact_person
Result: Complete billing analysis with client context
```

## Technical Implementation

### API Endpoints

#### GET `/api/reports/generate`

Returns available fields and relationships for report configuration.

**Response:**

```json
{
  "success": true,
  "data": {
    "availableFields": {
      "clients": ["id", "name", "contact_person", ...],
      "payrolls": ["id", "name", "status", ...],
      ...
    },
    "relationships": {
      "clients": {"payrolls": "payrolls"},
      "payrolls": {"client": "client", "payroll_dates": "payroll_dates"}
    },
    "domains": ["clients", "payrolls", "payroll_dates", "billing"]
  }
}
```

#### POST `/api/reports/generate`

Generates a report based on user configuration.

**Request:**

```json
{
  "domains": ["clients", "payrolls"],
  "fields": {
    "clients": ["name", "contact_person"],
    "payrolls": ["name", "status"]
  },
  "sortBy": "clients.name",
  "sortOrder": "asc",
  "limit": 100,
  "includeRelationships": true
}
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "clients_name": "Acme Corp",
      "clients_contact_person": "John Doe",
      "payrolls_name": "Acme Weekly Payroll",
      "payrolls_status": "Active"
    }
  ],
  "metadata": {
    "totalRecords": 25,
    "domains": ["clients", "payrolls"],
    "fields": {...}
  }
}
```

### Dynamic Query Generation

The system dynamically builds GraphQL queries based on user selections:

```graphql
query GenerateReport {
  clients(limit: 100, order_by: { name: ASC }) {
    name
    contact_person
    payrolls {
      name
      status
    }
  }
}
```

### Data Transformation

Results are transformed for CSV export with prefixed field names:

- `clients_name` instead of just `name`
- `payrolls_status` instead of just `status`
- Relationship counts added automatically

## Security & Permissions

### Access Control

- **Manager+ Required**: Only managers, admins, and developers can access
- **Audit Logging**: All report generation is logged
- **Data Filtering**: Respects existing row-level security

### Data Protection

- **Field Validation**: Only allowed fields can be selected
- **Query Limits**: Maximum 10,000 records per report
- **Relationship Validation**: Only valid relationships are processed

## Best Practices

### Performance

- Start with smaller field selections
- Use record limits for large datasets
- Consider relationship inclusion impact on performance

### Data Quality

- Verify field selections before generating
- Check preview data before downloading
- Use sorting to organize results logically

### Report Design

- Choose primary domain based on main focus
- Include related domains for context
- Use meaningful field combinations

## Troubleshooting

### Common Issues

**"No data returned"**

- Check if selected domains have data
- Verify field selections are valid
- Ensure relationships exist between domains

**"Query timeout"**

- Reduce record limit
- Select fewer fields
- Disable relationship inclusion

**"Download failed"**

- Check browser download settings
- Verify sufficient disk space
- Try smaller record sets

### Error Messages

- **"Insufficient permissions"**: Requires manager+ role
- **"Invalid field selection"**: Field not available in domain
- **"Relationship not found"**: Domains cannot be joined
- **"Query too complex"**: Reduce field/domain selections

## Future Enhancements

### Planned Features

- **Advanced Filtering**: Date ranges, status filters, custom criteria
- **Report Templates**: Save and reuse report configurations
- **Scheduled Reports**: Automated report generation and delivery
- **Chart Visualization**: Graphical representation of data
- **Excel Export**: Native Excel format support
- **Report Sharing**: Share reports with team members

### Technical Improvements

- **Query Optimization**: Better performance for complex reports
- **Caching**: Faster report generation for repeated queries
- **Real-time Data**: Live data updates during report generation
- **Custom Calculations**: Derived fields and aggregations

## Support

For technical support or feature requests:

- Check the troubleshooting section above
- Review error messages in browser console
- Contact development team for complex issues
- Submit enhancement requests through proper channels
