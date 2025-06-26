# Staff Details Page - User Guide

## Overview

The Staff Details page provides comprehensive user management and permission control capabilities. This guide explains how to use all features effectively.

## Accessing the Staff Details Page

1. Navigate to **Staff** from the main navigation
2. Click on any staff member name or the edit button
3. You'll be taken to the detailed staff member view

## Page Layout

### Header Section
- **Back Button**: Returns to the staff list
- **User Name & Status**: Shows the staff member's name and current status (Active/Inactive, Staff/User)
- **Actions Menu**: Provides edit and refresh options (requires appropriate permissions)

### Quick Stats Cards
Four cards showing key information at a glance:
- **Role**: Current system role (Viewer, Consultant, Manager, Org Admin, Developer)
- **Status**: Account status (Active/Inactive)
- **Staff Member**: Whether the user is marked as staff
- **Manager**: Assigned manager (if any)

### Tab Interface
Three main tabs organize different aspects of user management:

## Overview Tab

### Basic Information Card
Displays core user details:
- **Full Name**: User's complete name
- **Email**: Primary email address  
- **Username**: System username (if set)
- **Joined**: Account creation date

### Role & Access Card
Shows permission-related information:
- **Current Role**: User's system role with inline editor (for authorized users)
- **Account Status**: Active/Inactive status
- **Staff Member**: Staff designation status
- **Manager**: Assigned manager

## Permissions Tab

### Permission Matrix (Main Area)
A comprehensive view of all system permissions organized by category:

#### Permission Categories
- **Payroll**: payroll operations (read, write, delete, assign, approve)
- **Staff**: staff management (read, write, delete, invite, bulk update)
- **Client**: client management (read, write, delete, archive)
- **Admin**: administrative functions (manage, settings, billing)
- **Security**: security operations (read, write, manage)
- **Reporting**: reporting functions (read, export, schedule, audit operations)

#### Permission Status Indicators
- **Green dot**: User has this permission
- **Red dot**: User does not have this permission
- **Source label**: Shows whether permission comes from role or explicit override

#### Permission Actions
- **Search box**: Filter permissions by name
- **Manage Permissions button**: Open permission management dialog (requires staff:write permission)
- **Remove override (X)**: Remove specific permission overrides

### Active Overrides Panel (Sidebar)
Shows user-specific permission modifications:
- **Grant/Restrict badges**: Visual indicators of override type
- **Permission name**: Specific permission being overridden
- **Reason**: Explanation for the override
- **Expiration**: When the override expires (if applicable)
- **Remove button**: One-click override removal

## Activity Tab

Currently shows placeholder content for future activity tracking features:
- User activity history
- Permission change log
- Login/logout tracking
- Action audit trail

## User Management Tasks

### Editing User Information

1. Click **Actions** → **Edit User**
2. Update any of the following fields:
   - Full Name (required)
   - Email (required)
   - Username (optional)
   - Manager assignment
   - Staff member status (toggle)
   - Active account status (toggle)
3. Click **Save Changes**

### Changing User Roles

1. Go to the **Role & Access** card in the Overview tab
2. Click the role dropdown next to the current role
3. Select the new role from the list:
   - **Viewer**: Read-only access (3 permissions)
   - **Consultant**: Basic payroll operations (4 permissions)
   - **Manager**: Team and payroll management (12 permissions)
   - **Org Admin**: Organization administration (22 permissions)
   - **Developer**: Full system access (23 permissions)
4. The change takes effect immediately

### Managing Individual Permissions

#### Granting Additional Permissions

1. Go to the **Permissions** tab
2. Click **Manage Permissions**
3. Select **Grant Permission** as the action
4. Choose the permission from the categorized dropdown
5. Enter a required reason for the grant
6. Optionally set an expiration date
7. Click **Grant Permission**

#### Restricting Permissions

1. Go to the **Permissions** tab
2. Click **Manage Permissions**
3. Select **Restrict Permission** as the action
4. Choose the permission to restrict
5. Enter a required reason for the restriction
6. Optionally set an expiration date
7. Click **Restrict Permission**

#### Removing Permission Overrides

1. Find the permission with an override (marked with an X button)
2. Click the **X** button next to the permission
3. Confirm the removal
4. The permission reverts to the role-based default

## Permission System Logic

### Permission Priority Order
1. **Individual Restrictions** (highest priority) - Always deny access
2. **Individual Grants** - Override role permissions to allow access
3. **Role Permissions** (lowest priority) - Default permissions based on user role

### Role Hierarchy
Higher-level roles inherit permissions from lower levels:
- **Developer** (Level 5): All permissions
- **Org Admin** (Level 4): Most permissions except some developer tools
- **Manager** (Level 3): Team and operational management
- **Consultant** (Level 2): Basic payroll processing
- **Viewer** (Level 1): Read-only access

### Temporary Permissions
- Set expiration dates for permission overrides
- Automatically reverts to role-based permissions when expired
- Useful for temporary access grants

## Search and Filtering

### Permission Search
- Use the search box in the Permissions tab
- Search works across all permission names
- Real-time filtering as you type
- Case-insensitive search

### Category Organization
Permissions are automatically organized by category for easy browsing:
- Expand/collapse categories as needed
- Visual grouping makes finding permissions easier

## Required Permissions

### To View Staff Details
- **staff:read** permission required
- Access denied message shown if lacking permission

### To Edit User Information
- **staff:write** permission required
- Edit controls hidden if lacking permission

### To Manage Permissions
- **staff:write** permission required
- Permission management features hidden if lacking permission

## Best Practices

### Permission Management
1. **Always provide reasons** for permission changes (required for audit trail)
2. **Use temporary permissions** when possible for security
3. **Review active overrides regularly** to ensure they're still needed
4. **Prefer role changes** over individual permission grants when appropriate

### User Role Assignment
1. **Start with the lowest appropriate role** and add specific permissions as needed
2. **Use manager role** for team leads who need staff management capabilities
3. **Reserve org_admin and developer roles** for trusted administrators
4. **Regular review** of user roles and permissions

### Security Considerations
1. **Monitor permission changes** through the audit trail
2. **Set expiration dates** for temporary access
3. **Remove unused overrides** to maintain clean permission structure
4. **Document reasons clearly** for compliance and future reference

## Troubleshooting

### Common Issues

#### Changes Not Reflected
- **Refresh the page** if changes don't appear immediately
- **Check browser cache** if using cached data
- **Verify permissions** for the action you're trying to perform

#### Permission Denied Errors
- **Verify your role** has the required permissions
- **Contact your administrator** if you need additional access
- **Check for restrictions** that might override your role permissions

#### Role Changes Not Working
- **Ensure you have staff:write permission**
- **Check for active restrictions** that might prevent role changes
- **Verify the target role** is valid for the user

### Getting Help
- **Contact your system administrator** for permission-related issues
- **Check the audit log** for recent permission changes
- **Review role documentation** for understanding permission scope

## Keyboard Shortcuts

- **Tab**: Navigate between form fields
- **Enter**: Submit forms and confirm actions
- **Escape**: Close dialogs and cancel operations
- **Space**: Toggle checkboxes and switches

## Mobile Usage

The staff details page is fully responsive and works on mobile devices:
- **Touch-friendly buttons** and controls
- **Responsive layout** adapts to screen size
- **Swipe navigation** between tabs
- **Optimized text size** for mobile viewing

This user guide provides comprehensive instructions for effectively managing staff members and their permissions through the enhanced staff details interface.