# Work Schedule System Usage Guide

The work schedule system has been implemented and is ready for use. Here's how to set it up and use it:

## Setup and Seeding Data

### Method 1: Using API Endpoints (Recommended)

1. **Test the system:**
   ```bash
   curl -X GET http://localhost:3000/api/work-schedule/test
   ```

2. **Seed work schedule data:**
   ```bash
   curl -X POST http://localhost:3000/api/work-schedule/seed
   ```

### Method 2: Using Scripts (Requires environment variables)

1. **Seed work schedule data:**
   ```bash
   pnpm test:work-schedule:seed
   ```

2. **Clean work schedule data:**
   ```bash
   pnpm test:work-schedule:clean
   ```

3. **Reseed (clean + seed):**
   ```bash
   pnpm test:work-schedule:reseed
   ```

## Work Schedule System Features

### Database Schema
- **work_schedule table**: Stores individual work schedule entries
- **Fields**: userId, workDay, workHours, adminTimeHours, payrollCapacityHours, usesDefaultAdminTime
- **Relationships**: Linked to users table with scheduleOwner relationship

### Default Schedule by Role

The system automatically creates work schedules based on user roles:

- **Developer**: 5 days/week, 8 hours/day, 0% admin time, 0 payroll capacity
- **Org Admin**: 5 days/week, 8 hours/day, 50% admin time, 4h payroll capacity/day
- **Manager**: 5 days/week, 8 hours/day, 30% admin time, 5.6h payroll capacity/day  
- **Consultant**: 5 days/week, 8 hours/day, 12.5% admin time, 7h payroll capacity/day
- **Viewer**: 3 days/week, 4 hours/day, 0% admin time, 0 payroll capacity

### GraphQL Operations

#### Queries
- `GetAllStaffWorkload`: Get all staff with their work schedules and payroll assignments
- `GetAvailableConsultants`: Get consultants available for payroll assignment
- `GetUserWorkSchedules`: Get work schedules for a specific user
- `GetTeamCapacityDashboard`: Get capacity overview for a team

#### Mutations
- `UpsertWorkSchedule`: Create or update a work schedule entry
- `UpdateUserDefaultAdminTime`: Update user's default admin time percentage
- `AssignPayrollToConsultant`: Assign payroll to a consultant
- `BulkAssignPayrolls`: Assign multiple payrolls at once

### UI Components

#### Main Work Schedule Page
Location: `/work-schedule`

Features:
- **Capacity Dashboard**: View team capacity and utilization
- **Assignment Wizard**: Assign payrolls to consultants based on capacity
- **Workload Visualization**: Visual representation of each consultant's workload

#### Key Components
- `CapacityDashboard`: Shows team capacity metrics and individual schedules
- `AssignmentWizard`: Intelligent payroll assignment interface
- `PayrollWorkloadVisualization`: Visual workload display for consultants

## Usage Examples

### 1. View Work Schedule Dashboard
Navigate to `/work-schedule` in the application to see:
- Team capacity overview
- Individual consultant schedules
- Payroll assignment interface

### 2. Update Work Schedule
```typescript
// Using the UpsertWorkSchedule mutation
const { data } = await upsertWorkSchedule({
  variables: {
    userId: "user-uuid",
    workDay: "Monday",
    workHours: 8,
    adminTimeHours: 1,
    payrollCapacityHours: 7,
    usesDefaultAdminTime: false
  }
});
```

### 3. Assign Payroll to Consultant
```typescript
// Using the AssignPayrollToConsultant mutation
const { data } = await assignPayrollToConsultant({
  variables: {
    payrollId: "payroll-uuid",
    primaryConsultantUserId: "consultant-uuid",
    managerUserId: "manager-uuid"
  }
});
```

## Troubleshooting

### Common Issues

1. **No work schedule data showing**
   - Ensure users exist in the database
   - Run the seed script or API endpoint
   - Check that users have `isStaff: true` and `isActive: true`

2. **GraphQL errors**
   - Ensure Hasura is running
   - Check environment variables
   - Verify GraphQL schema is up to date

3. **Permission errors**
   - Ensure user has appropriate role
   - Check authentication setup
   - Verify JWT tokens are valid

### Data Validation

- Work hours must be positive numbers
- Admin time hours cannot exceed work hours
- Payroll capacity is automatically calculated as: workHours - adminTimeHours
- Each user can only have one schedule per day (unique constraint)

## Integration Points

The work schedule system integrates with:
- **User Management**: Uses user roles and hierarchy
- **Payroll System**: Assigns payrolls based on capacity
- **Authentication**: Uses Clerk for user authentication
- **Audit System**: Tracks all schedule changes

## Next Steps

To fully activate the work schedule system:
1. Seed data using the provided methods
2. Configure user roles and permissions
3. Test the assignment workflow
4. Train users on the interface
5. Monitor capacity utilization metrics