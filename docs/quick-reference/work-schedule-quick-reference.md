# Work Schedule System - Quick Reference

## 🚀 Quick Start

### For Managers
1. **Navigate**: Sidebar → **Work Schedule**
2. **Dashboard**: View team capacity at a glance
3. **Edit Schedules**: Click team member cards → Edit work hours
4. **Assign Payrolls**: Use Assignment Wizard tab
5. **Analytics**: Check Workload Visualization tab

### For Consultants  
1. **Navigate**: Sidebar → **Profile** → **Workload** tab
2. **View Schedule**: See your personal payroll calendar
3. **Check Capacity**: Monitor daily/weekly/monthly workload
4. **Track Assignments**: Review client payroll details

---

## 🎯 Key Features at a Glance

| Feature | Location | Access Level | Purpose |
|---------|----------|--------------|---------|
| **Capacity Dashboard** | Work Schedule → Capacity | Manager+ | Team capacity planning |
| **Assignment Wizard** | Work Schedule → Assignment | Manager+ | Smart payroll assignment |
| **Workload Visualization** | Work Schedule → Workload | Manager+ | Team analytics |
| **Personal Workload** | Profile → Workload | All Users | Individual tracking |

---

## 📊 Understanding the Visualizations

### Color Coding
- 🟢 **Green**: Under 80% capacity (healthy)
- 🟡 **Yellow**: 80-100% capacity (optimal)
- 🔴 **Red**: Over 100% capacity (overallocated)

### Chart Types
- **Bar Charts**: Hours vs capacity comparison
- **Calendar View**: Assignment distribution over time
- **Summary Cards**: Key metrics overview

### Time Periods
- **Day View**: 7-day individual breakdown
- **Week View**: 4-week period overview  
- **Month View**: 3-month trend analysis

---

## ⚡ Quick Actions

### Manager Actions
```
Edit Work Schedule:
1. Capacity Dashboard → Team Member Card → Edit Icon
2. Modify hours for any day
3. Adjust admin time percentage
4. Save changes

Assign Payroll:
1. Assignment Wizard → Select Unassigned Payroll
2. Review recommendations (Green = best fit)
3. Choose consultant
4. Confirm assignment

Bulk Assign:
1. Assignment Wizard → Select Multiple Payrolls
2. Auto-assign based on capacity
3. Review and approve changes
```

### Consultant Actions
```
Check Daily Workload:
1. Profile → Workload → Daily View
2. Review today's assignments
3. Note processing deadlines

Weekly Planning:
1. Switch to Weekly View
2. Identify peak days (red bars)
3. Plan admin time around busy periods

Monthly Analysis:
1. Switch to Monthly View
2. Review utilization trends
3. Discuss patterns with manager
```

---

## 🔧 Developer Quick Reference

### Key Files
```
/domains/work-schedule/
├── components/
│   ├── capacity-dashboard.tsx      # Main manager dashboard
│   ├── assignment-wizard.tsx       # Smart assignment tool
│   └── payroll-workload-visualization.tsx # Charts & analytics
├── graphql/
│   ├── queries.graphql             # Data fetching
│   ├── mutations.graphql           # Data updates
│   └── workload-queries.graphql    # Visualization queries
└── hooks/
    └── use-payroll-workload.ts     # Data management hook
```

### Key Components
```typescript
// Capacity Dashboard (Manager View)
<CapacityDashboard
  teamMembers={teamMembers}
  managerId={managerId}
  onUpdateWorkSchedule={handleUpdate}
  onUpdateAdminTime={handleAdminUpdate}
/>

// Workload Visualization (Both Views)
<PayrollWorkloadVisualization
  userId={userId}
  userName={userName}
  workSchedule={workScheduleData}
  viewMode="consultant" // or "manager"
  showCapacityComparison={true}
/>

// Assignment Wizard (Manager Only)
<AssignmentWizard
  payrolls={unassignedPayrolls}
  consultants={availableConsultants}
  onAssignPayroll={handleAssignment}
  onBulkAssign={handleBulkAssignment}
/>
```

### Key GraphQL Operations
```graphql
# Get team capacity (managers)
query GetTeamCapacityDashboard($managerId: uuid!) { ... }

# Get personal workload (consultants)
query GetConsultantPayrollWorkload($userId: uuid!, $startDate: date!, $endDate: date!) { ... }

# Update work schedule
mutation UpsertWorkSchedule($userId: uuid!, $workDay: String!, $workHours: numeric!) { ... }

# Update admin time
mutation UpdateUserDefaultAdminTime($userId: uuid!, $percentage: numeric!) { ... }
```

---

## 🎨 UI Components Reference

### Permission Guards
```typescript
// Restrict manager features
<ManagerOnly fallback={<PersonalView />}>
  <TeamDashboard />
</ManagerOnly>

// Check specific permissions
{canAccessFeature(userRole, 'EDIT_WORK_SCHEDULES') && (
  <EditButton onClick={handleEdit} />
)}
```

### Loading States
```typescript
// Smart loading with skeletons
<SmartLoadingSpinner isLoading={loading} fallback={<CapacityDashboardSkeleton />}>
  <CapacityDashboard />
</SmartLoadingSpinner>

// Simple loading state
{loading ? <ByteMySpinner size="lg" /> : <Dashboard />}
```

### Error Handling
```typescript
// Standard error display
{error && (
  <Alert variant="destructive">
    <AlertTriangle className="h-4 w-4" />
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
)}
```

---

## 📱 Mobile Responsiveness

### Breakpoints
- **Desktop**: `md:` and above (768px+)
- **Tablet**: `sm:` to `md:` (640px - 768px)
- **Mobile**: Base styles (0 - 640px)

### Mobile Optimizations
- Grid layouts collapse to single column
- Charts maintain aspect ratio
- Touch-friendly button sizes (min 44px)
- Simplified navigation on small screens

---

## 🔍 Troubleshooting Quick Fixes

### Common Issues

**"No Team Members Found"**
```
Cause: Manager role not assigned or no direct reports
Fix: Contact admin to verify role permissions
```

**Charts Not Loading**
```
Cause: Network or data loading issues
Fix: 1. Refresh page 2. Check internet 3. Clear cache
```

**Permission Denied**
```
Cause: Insufficient role permissions  
Fix: Verify role with administrator
```

**Missing Work Schedule Data**
```
Cause: Work schedules not configured
Fix: Manager needs to set up schedules in Capacity Dashboard
```

### Performance Issues
```
Slow Loading:
- Check network connection
- Reduce date range for large datasets
- Close unnecessary browser tabs

Memory Issues:
- Refresh page periodically
- Use supported browsers (Chrome, Firefox, Safari)
- Update browser to latest version
```

---

## 📞 Support Contacts

### Issue Types
- **Workflow Questions**: Your immediate manager
- **Technical Problems**: IT Helpdesk  
- **Access Issues**: System administrator
- **Feature Requests**: Development team

### Self-Service Resources
1. **This Documentation**: Complete feature guide
2. **In-App Help**: Tooltips and contextual help
3. **User Training**: Available through HR
4. **Video Tutorials**: Coming soon

---

## ⚙️ Configuration Options

### Display Preferences
- **Chart Colors**: Follows system theme (light/dark)
- **Time Zones**: Automatically uses browser timezone
- **Date Format**: Australian format (DD/MM/YYYY)
- **Currency**: AUD (Australian Dollars)

### Notification Settings
- **Assignment Updates**: Real-time notifications
- **Capacity Warnings**: Email alerts for overallocation  
- **Schedule Changes**: Instant updates to affected users
- **System Maintenance**: Advance notice of downtime

---

## 🔄 Data Refresh & Sync

### Automatic Updates
- **Real-time**: Assignment changes, schedule updates
- **Every 5 minutes**: Capacity calculations, utilization metrics
- **Daily**: Performance statistics, trend analysis
- **Weekly**: Comprehensive team reports

### Manual Refresh
- **Refresh Button**: Updates current view data
- **Page Reload**: Full data synchronization
- **Cache Clear**: Browser settings → Clear cache
- **Force Sync**: Contact IT if data appears stale

---

## 📊 Metrics & KPIs

### Team Performance Indicators
- **Average Utilization**: Team-wide capacity usage
- **Overallocation Rate**: Percentage of over-capacity periods
- **Assignment Efficiency**: Time from payroll creation to assignment
- **Capacity Planning Accuracy**: Forecast vs actual utilization

### Individual Metrics
- **Personal Utilization**: Your capacity usage over time
- **Assignment Completion Rate**: On-time payroll processing
- **Admin Time Ratio**: Administrative vs payroll work balance
- **Workload Distribution**: Even vs peak period analysis

---

*This quick reference provides essential information for daily use of the Work Schedule System. For comprehensive details, refer to the complete user guide and developer documentation.*

**Last Updated**: January 2025 | **Version**: 2.0 | **System**: Payroll Matrix Work Schedule