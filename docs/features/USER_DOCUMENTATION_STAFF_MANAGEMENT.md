# 👥 Staff Management System - User Guide

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Staff Management Dashboard](#staff-management-dashboard)
4. [Managing Staff Members](#managing-staff-members)
5. [Role-Based Access Control](#role-based-access-control)
6. [Troubleshooting](#troubleshooting)
7. [Frequently Asked Questions](#frequently-asked-questions)

---

## Overview

The Staff Management System is a comprehensive solution for managing your organization's workforce. It provides tools for creating, viewing, editing, and managing staff members with sophisticated role-based access controls and authentication integration.

### Key Features

✅ **Complete Staff Lifecycle Management** - Create, view, edit, and deactivate staff members  
✅ **Role-Based Access Control** - Developer, Admin, Manager, Consultant, and Viewer roles  
✅ **Advanced Filtering & Search** - Find staff quickly with multiple filter options  
✅ **Real-time Statistics** - Live dashboard with staff metrics and insights  
✅ **Authentication Integration** - Seamless Clerk authentication synchronization  
✅ **Audit Trail** - Complete history preservation with soft deletion

---

## Getting Started

### Prerequisites

- You must have an active account with appropriate permissions
- Minimum role required: **Viewer** (for viewing staff), **Manager** (for team management), **Admin/Developer** (for full access)

### Accessing Staff Management

1. **Login** to your account using your credentials
2. Navigate to **Staff Management** from the main dashboard
3. The system will automatically show you content based on your role permissions

---

## Staff Management Dashboard

### 📊 Statistics Overview

The dashboard provides real-time insights into your workforce:

#### **Total Staff Card**

- Shows total number of staff members
- Displays active vs inactive breakdown
- Updates in real-time as changes are made

#### **Administrators Card**

- Combines Developers and Admins count
- Color-coded badge showing total admin users
- Breakdown between developers and standard admins

#### **Managers Card**

- Count of all staff with manager-level access
- Shows team oversight responsibilities

#### **Staff Card**

- Combined count of consultants and viewers
- Detailed breakdown of each role type

### 🔍 Advanced Filtering System

The filtering system allows you to quickly find specific staff members:

#### **Search Bar**

- **Location**: Top of the filters section with search icon
- **Functionality**: Real-time search across:
  - Staff member names
  - Email addresses
  - Usernames
- **Usage**: Type any part of the information you're looking for

#### **Role Filter**

- **Options Available**:
  - All Roles (default)
  - Developers
  - Admins
  - Managers
  - Consultants
  - Viewers
- **Usage**: Select from dropdown to filter by specific role

#### **Manager Filter**

- **Purpose**: Filter staff by their assigned manager
- **Options**: Shows all users with manager-level permissions
- **Usage**: Select a manager to see their direct reports

#### **Refresh Button**

- **Location**: Right side of filter bar
- **Purpose**: Reload data from the server
- **Visual**: Shows spinning animation while loading

---

## Managing Staff Members

### 👀 Viewing Staff Details

#### **Quick View (Table)**

Each staff member row shows:

- **Avatar**: Profile image or default user icon
- **Name & Username**: Primary identification
- **Email**: Contact information with mail icon
- **Role**: Color-coded badge indicating access level
- **Manager**: Assigned supervisor (if any)
- **Status**: Active/Inactive and authentication status

#### **Detailed View Modal**

Click the **"View"** button to see comprehensive details:

**Contact Information**

- Email address
- Username (if set)

**Work Information**

- Assigned manager
- Staff status (Staff Member vs External)

**System Information**

- Unique user ID
- Clerk authentication connection status
- Account creation date

### ✏️ Editing Staff Members

**Who Can Edit**: Only Administrators and Developers

#### **Opening the Edit Modal**

1. Locate the staff member in the table
2. Click the **"Edit"** button (pencil icon)
3. The edit modal will open with current information pre-filled

#### **Editable Fields**

**Personal Information**

- **Full Name**: Staff member's complete name
- **Email Address**: Primary contact email
- **Username**: Optional display name

**Role Assignment**

- **Role**: Select from available roles (Developer, Admin, Manager, Consultant, Viewer)
- **Manager**: Assign a supervisor (optional, shows eligible managers only)
- **Staff Status**: Toggle between "Staff Member" and "External"

#### **Saving Changes**

1. Make your desired changes in the form
2. Click **"Save Changes"** button
3. System will:
   - Update the database
   - Sync with Clerk authentication (if account exists)
   - Show success message with sync status
   - Refresh the staff list automatically

### ➕ Creating New Staff Members

**Who Can Create**: Only Administrators and Developers

1. Click the **"Add Staff Member"** button (plus icon) in the top-right
2. You'll be redirected to the staff creation page
3. Fill in the required information
4. The system will create accounts in both database and authentication system

### 🗑️ Deactivating Staff Members

**Who Can Deactivate**: Only Administrators and Developers

#### **Soft Deletion Process**

The system uses "soft deletion" to preserve data integrity:

1. Click the **trash icon** next to the staff member
2. A confirmation dialog will appear explaining what happens:

   - User marked as inactive in database
   - User removed from Clerk authentication (immediate access loss)
   - All historical data preserved for audit purposes
   - **Action cannot be undone**

3. Click **"Deactivate User"** to confirm
4. System provides feedback about the deactivation status

---

## Role-Based Access Control

### 🔐 Permission Matrix

| Feature            | Viewer | Consultant | Manager        | Admin | Developer |
| ------------------ | ------ | ---------- | -------------- | ----- | --------- |
| View Staff List    | ✅     | ✅         | ✅ (Team Only) | ✅    | ✅        |
| View Staff Details | ✅     | ✅         | ✅             | ✅    | ✅        |
| Edit Staff         | ❌     | ❌         | ❌             | ✅    | ✅        |
| Create Staff       | ❌     | ❌         | ❌             | ✅    | ✅        |
| Deactivate Staff   | ❌     | ❌         | ❌             | ✅    | ✅        |
| Access All Staff   | ❌     | ❌         | ❌             | ✅    | ✅        |

### 👨‍💼 Manager-Specific Features

**Managers** have a specialized view:

- Can only see their direct reports
- Dashboard shows "Your Team" instead of "All Staff"
- Statistics are calculated based on team members only
- Cannot edit or create staff members

### 🔧 Role Descriptions

**Developer (Admin Role)**

- Highest level of access
- Can manage all staff members
- System administration capabilities
- Full CRUD (Create, Read, Update, Delete) permissions

**Admin (Org Admin Role)**

- Organization-level administration
- Can manage all staff members
- Full CRUD permissions
- Focused on business operations

**Manager**

- Team leadership role
- View-only access to their direct reports
- Cannot modify staff information
- Sees team-specific statistics

**Consultant**

- Project-based access level
- Can view all staff information
- Read-only permissions
- No management capabilities

**Viewer**

- Basic access level
- Can view all staff information
- Read-only permissions
- Limited to information consumption

---

## Troubleshooting

### 🚨 Common Issues & Solutions

#### **"Cannot see staff members"**

**Possible Causes:**

- Insufficient permissions
- Manager viewing outside their team
- Network connectivity issues

**Solutions:**

1. Check your role permissions with an administrator
2. If you're a manager, ensure you're viewing your team members only
3. Try refreshing the page using the refresh button
4. Contact support if the issue persists

#### **"Edit button is grayed out"**

**Cause:** You don't have edit permissions

**Solution:** Only Administrators and Developers can edit staff. Contact your system administrator if you need editing access.

#### **"Changes not saving"**

**Possible Causes:**

- Network connectivity issues
- Server-side validation errors
- Authentication session expired

**Solutions:**

1. Check your internet connection
2. Verify all required fields are filled correctly
3. Try logging out and back in
4. Contact support with error details

#### **"Staff member appears twice"**

**Cause:** This typically indicates a sync issue between database and authentication system

**Solution:**

1. Try refreshing the page
2. Contact an administrator to check sync status
3. Use the developer tools to investigate sync issues

### 🔄 Sync Status Messages

The system provides detailed feedback about synchronization:

**✅ "Updated successfully and synced with Clerk!"**

- Database updated ✓
- Authentication system updated ✓
- All systems in sync

**⚠️ "Updated successfully (database only - no Clerk account found)"**

- Database updated ✓
- No authentication account to sync
- Normal for external staff members

**❌ "Failed to update: [Error message]"**

- Update failed
- Check error message for specific issue
- Contact support if needed

---

## Frequently Asked Questions

### **Q: What's the difference between "Staff" and "External" status?**

**A:**

- **Staff Members**: Full employees with company benefits and internal access
- **External**: Contractors, consultants, or vendors with limited access needs

### **Q: Can I bulk edit multiple staff members?**

**A:** Currently, the system requires individual editing for each staff member. Bulk operations may be added in future updates.

### **Q: What happens to a deactivated user's data?**

**A:** All historical data is preserved in the database for audit purposes. Only their access is removed, and they're marked as inactive.

### **Q: Can I reactivate a deactivated staff member?**

**A:** Currently, deactivation is permanent through the UI. Contact a system administrator for reactivation requests.

### **Q: Why can't I see all staff members as a manager?**

**A:** Managers are restricted to viewing only their direct reports for privacy and organizational structure reasons.

### **Q: How often do the statistics update?**

**A:** Statistics update in real-time as changes are made to staff data.

### **Q: What does "Active Auth" vs "No Auth" status mean?**

**A:**

- **Active Auth**: User has a Clerk authentication account and can log in
- **No Auth**: User exists in database only, cannot log in (typical for external users)

### **Q: Can I change my own role?**

**A:** No, users cannot modify their own role. Contact an administrator for role change requests.

### **Q: What if I accidentally deactivate someone?**

**A:** Contact a system administrator immediately. While the UI shows it as permanent, administrators may be able to restore access through backend tools.

### **Q: How do I report a bug or request a feature?**

**A:** Contact your system administrator or use the feedback mechanisms provided in your organization's support channels.

---

## 📞 Getting Help

If you need additional assistance:

1. **Check this documentation** for answers to common questions
2. **Contact your system administrator** for role or permission issues
3. **Report bugs or issues** through your organization's support channels
4. **Request training** if you need help using specific features

---

_Last Updated: January 2025_  
_Version: 1.0_

> **Note**: This documentation corresponds to the latest version of the Staff Management System. Features and interfaces may vary if you're using an older version.
