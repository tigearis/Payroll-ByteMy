# Bulk Upload Guide

This guide explains how to use the bulk upload feature to create multiple clients and payrolls at once using CSV files.

## Overview

The bulk upload feature allows authorized users (managers and above) to upload CSV files to create multiple records simultaneously. This is particularly useful for:

- Onboarding multiple clients at once
- Setting up payroll configurations for new clients
- Migrating data from other systems
- Batch operations for efficiency

## Access Control

- **Required Role**: Manager, Org Admin, or Developer
- **Location**: `/bulk-upload` in the sidebar navigation
- **Audit**: All bulk operations are logged for compliance

## Client Upload

### CSV Format

Download the template from the interface or use this format:

```csv
name,contactPerson,contactEmail,contactPhone,active
"Acme Corporation","John Smith","john@acme.com","+61 2 1234 5678",true
"Tech Solutions","Jane Doe","jane@techsolutions.com","+61 3 9876 5432",true
"Global Industries","Bob Wilson","bob@global.com","+61 7 5555 1234",false
```

### Required Fields

| Field           | Required | Type    | Description                      |
| --------------- | -------- | ------- | -------------------------------- |
| `name`          | Yes      | String  | Client company name              |
| `contactPerson` | No       | String  | Primary contact person           |
| `contactEmail`  | No       | Email   | Contact email address            |
| `contactPhone`  | No       | String  | Contact phone number             |
| `active`        | No       | Boolean | Client status (defaults to true) |

### Validation Rules

- **Client name**: Required, minimum 1 character
- **Contact email**: If provided, must be valid email format
- **Active status**: Accepts "true", "false", "yes", "no" (case insensitive)
- **Empty fields**: Can be left empty or omitted

## Payroll Upload

### CSV Format

Download the template from the interface or use this format:

```csv
name,clientName,cycleName,dateTypeName,dateValue,primaryConsultantEmail,backupConsultantEmail,managerEmail,processingTime,processingDaysBeforeEft,employeeCount,payrollSystem,status
"Acme Weekly Payroll","Acme Corporation","Weekly","DayOfWeek",1,"consultant@company.com","backup@company.com","manager@company.com",2,2,50,"Xero","Implementation"
"Tech Monthly Payroll","Tech Solutions","Monthly","DayOfMonth",15,"consultant@company.com","","manager@company.com",4,3,25,"MYOB","Active"
```

### Required Fields

| Field                     | Required | Type    | Description                                                   |
| ------------------------- | -------- | ------- | ------------------------------------------------------------- |
| `name`                    | Yes      | String  | Payroll name                                                  |
| `clientName`              | Yes      | String  | Must match existing client name                               |
| `cycleName`               | Yes      | Enum    | Weekly, Biweekly, Monthly, Quarterly, Annually                |
| `dateTypeName`            | Yes      | Enum    | DayOfMonth, DayOfWeek, RelativeToMonth                        |
| `dateValue`               | No       | Integer | Specific value for date calculation                           |
| `primaryConsultantEmail`  | Yes      | Email   | Must match existing user email                                |
| `backupConsultantEmail`   | No       | Email   | Must match existing user email                                |
| `managerEmail`            | Yes      | Email   | Must match existing user email                                |
| `processingTime`          | No       | Integer | Hours required (defaults to 1)                                |
| `processingDaysBeforeEft` | No       | Integer | Days before EFT (defaults to 2)                               |
| `employeeCount`           | No       | Integer | Number of employees                                           |
| `payrollSystem`           | No       | String  | External system name                                          |
| `status`                  | No       | Enum    | Implementation, Active, Inactive (defaults to Implementation) |

### Validation Rules

- **Client name**: Must exist in the system
- **Cycle name**: Must be one of the predefined values
- **Date type name**: Must be one of the predefined values
- **Email addresses**: Must match existing users in the system
- **Numeric fields**: Must be valid integers
- **Status**: Must be one of the predefined values

## Usage Instructions

### Step 1: Access the Upload Interface

1. Navigate to the sidebar and click "Bulk Upload"
2. Ensure you have the required permissions (Manager or higher)

### Step 2: Download Template

1. Select the appropriate tab (Clients or Payrolls)
2. Click "Download Template" to get the CSV format
3. Open the template in your preferred spreadsheet application

### Step 3: Prepare Your Data

1. Fill in the template with your data
2. Ensure all required fields are completed
3. Validate email addresses and references
4. Save as CSV format

### Step 4: Upload File

1. Drag and drop your CSV file onto the upload area
2. Or click "Choose File" to browse and select
3. Review the file details
4. Click "Upload [Clients/Payrolls]" to start processing

### Step 5: Review Results

1. Monitor the progress bar during upload
2. Review the success/failure summary
3. Check the detailed error report if any failures occurred
4. Address any validation errors and re-upload if needed

## Error Handling

### Common Validation Errors

| Error Type             | Cause                      | Solution                                |
| ---------------------- | -------------------------- | --------------------------------------- |
| Missing required field | Required field is empty    | Fill in the required field              |
| Invalid email format   | Email doesn't match format | Check email syntax                      |
| Client not found       | Client name doesn't exist  | Create client first or check spelling   |
| User not found         | Email doesn't match user   | Verify user exists and email is correct |
| Invalid enum value     | Value not in allowed list  | Use one of the predefined values        |

### Error Report Format

Errors are displayed with:

- **Row number**: Which row in the CSV had the error
- **Field name**: Which field had the problem
- **Error message**: Description of the issue
- **Data**: The actual data that caused the error

## Best Practices

### Data Preparation

1. **Use templates**: Always download and use the provided templates
2. **Validate data**: Check all email addresses and references before uploading
3. **Test small batches**: Start with a few records to test the process
4. **Backup data**: Keep a copy of your original data

### File Management

1. **CSV format**: Ensure files are saved as CSV (not Excel)
2. **Encoding**: Use UTF-8 encoding for special characters
3. **File size**: Keep files under 10MB for optimal performance
4. **Headers**: Don't modify the header row

### Security Considerations

1. **Access control**: Only authorized users can perform bulk uploads
2. **Audit trail**: All operations are logged for compliance
3. **Validation**: All data is validated before processing
4. **Error handling**: Failed records don't affect successful ones

## Troubleshooting

### Upload Fails Completely

- Check file format (must be CSV)
- Verify file size (under 10MB)
- Ensure you have proper permissions
- Check network connection

### Some Records Fail

- Review the error report
- Fix validation issues in your data
- Re-upload with corrected data
- Check that referenced entities exist

### Template Download Issues

- Check browser download settings
- Try refreshing the page
- Verify you have proper permissions
- Contact support if issue persists

## API Reference

### Endpoints

- `GET /api/bulk-upload/clients` - Download client template
- `POST /api/bulk-upload/clients` - Upload client CSV
- `GET /api/bulk-upload/payrolls` - Download payroll template
- `POST /api/bulk-upload/payrolls` - Upload payroll CSV

### Response Format

```json
{
  "success": true,
  "message": "Successfully created 5 clients, 2 failed",
  "data": {
    "created": 5,
    "failed": 2,
    "errors": [
      {
        "row": 3,
        "field": "contactEmail",
        "message": "Invalid email format",
        "data": { "contactEmail": "invalid-email" }
      }
    ]
  }
}
```

## Support

If you encounter issues with bulk upload:

1. Check this documentation first
2. Review the error messages carefully
3. Validate your data against the requirements
4. Contact your system administrator
5. Check the audit logs for detailed information

---

_Last Updated: December 2024_
_Next Review: January 2025_
