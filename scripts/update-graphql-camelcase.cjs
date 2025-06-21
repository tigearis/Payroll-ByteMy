#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Define the snake_case to camelCase mappings based on our Hasura metadata
const fieldMappings = {
  // Users table
  is_staff: "isStaff",
  is_active: "isActive",
  manager_id: "managerId",
  clerk_user_id: "clerkUserId",
  created_at: "createdAt",
  updated_at: "updatedAt",
  avatar_url: "avatarUrl",
  job_title: "jobTitle",
  hire_date: "hireDate",
  employee_id: "employeeId",
  emergency_contact_name: "emergencyContactName",
  emergency_contact_phone: "emergencyContactPhone",
  postal_code: "postalCode",
  date_of_birth: "dateOfBirth",
  tax_file_number: "taxFileNumber",
  super_fund_name: "superFundName",
  super_fund_account: "superFundAccount",
  bank_account_name: "bankAccountName",
  bank_account_number: "bankAccountNumber",
  bank_bsb: "bankBsb",
  permissions_last_updated: "permissionsLastUpdated",
  last_login_at: "lastLoginAt",
  user_roles: "userRoles",
  role_name: "roleName",
  granted_at: "grantedAt",
  granted_by: "grantedBy",
  role_permissions: "rolePermissions",
  permission_name: "permissionName",

  // Payrolls table
  client_id: "clientId",
  cycle_id: "cycleId",
  date_type_id: "dateTypeId",
  primary_consultant_user_id: "primaryConsultantUserId",
  backup_consultant_user_id: "backupConsultantUserId",
  manager_user_id: "managerUserId",
  employee_count: "employeeCount",
  go_live_date: "goLiveDate",
  processing_days_before_eft: "processingDaysBeforeEft",
  date_value: "dateValue",
  parent_payroll_id: "parentPayrollId",
  version_number: "versionNumber",
  superseded_date: "supersededDate",
  superseded_by: "supersededBy",
  superseded_reason: "supersededReason",

  // Payroll dates table
  payroll_id: "payrollId",
  date_type_id: "dateTypeId",
  original_date: "originalDate",
  adjusted_date: "adjustedDate",
  is_adjusted: "isAdjusted",
  adjustment_reason: "adjustmentReason",
  original_eft_date: "originalEftDate",
  adjusted_eft_date: "adjustedEftDate",
  processing_date: "processingDate",

  // Clients table
  contact_person: "contactPerson",
  contact_email: "contactEmail",
  contact_phone: "contactPhone",
  billing_address: "billingAddress",
  billing_city: "billingCity",
  billing_state: "billingState",
  billing_postal_code: "billingPostalCode",
  billing_country: "billingCountry",

  // Payroll assignments table
  consultant_id: "consultantId",
  assigned_by: "assignedBy",
  assigned_at: "assignedAt",
  original_consultant_id: "originalConsultantId",

  // User roles table
  user_id: "userId",
  role_id: "roleId",

  // Roles table
  role_name: "roleName",
  role_description: "roleDescription",
  hierarchy_level: "hierarchyLevel",

  // Permissions table
  permission_name: "permissionName",
  resource_id: "resourceId",
  action_name: "actionName",
  permission_description: "permissionDescription",

  // Permission audit log table
  resource_name: "resourceName",
  was_granted: "wasGranted",
  checked_at: "checkedAt",

  // Permission overrides table
  permission_id: "permissionId",
  is_granted: "isGranted",
  granted_by: "grantedBy",
  expires_at: "expiresAt",

  // Audit log table
  entity_type: "entityType",
  entity_id: "entityId",
  action_type: "actionType",
  old_values: "oldValues",
  new_values: "newValues",
  ip_address: "ipAddress",
  user_agent: "userAgent",
  session_id: "sessionId",

  // Work schedule table
  day_of_week: "dayOfWeek",
  start_time: "startTime",
  end_time: "endTime",
  is_working_day: "isWorkingDay",
  break_duration_minutes: "breakDurationMinutes",

  // Leave table
  leave_type: "leaveType",
  start_date: "startDate",
  end_date: "endDate",
  total_days: "totalDays",
  approved_by: "approvedBy",
  approved_at: "approvedAt",

  // Common table names
  users_by_pk: "users_by_pk", // Keep as is - this is a Hasura root field
  payrolls_by_pk: "payrolls_by_pk", // Keep as is
  clients_by_pk: "clients_by_pk", // Keep as is
  payroll_dates: "payrollDates",
  payroll_cycle: "payrollCycle",
  payroll_date_type: "payrollDateType",
  payroll_assignments: "payrollAssignments",
  external_systems: "externalSystems",
  client_external_systems: "clientExternalSystems",
  work_schedule: "workSchedule",
};

// Get all GraphQL files
function getAllGraphQLFiles() {
  const result = execSync('find . -name "*.graphql" -type f', {
    encoding: "utf8",
  });
  return result
    .trim()
    .split("\n")
    .filter((file) => file.length > 0);
}

// Update a single file
function updateFile(filePath) {
  console.log(`Updating ${filePath}...`);

  let content = fs.readFileSync(filePath, "utf8");
  let updated = false;
  let originalContent = content;

  // Apply field mappings with more comprehensive patterns
  for (const [snakeCase, camelCase] of Object.entries(fieldMappings)) {
    // Skip if already converted
    if (snakeCase === camelCase) continue;

    // Pattern 1: Field names in selection sets
    const fieldRegex = new RegExp(
      `^(\\s*)${snakeCase}(\\s*$|\\s*{|\\s*\\(|\\s*:)`,
      "gm"
    );
    if (content.match(fieldRegex)) {
      content = content.replace(fieldRegex, `$1${camelCase}$2`);
      updated = true;
    }

    // Pattern 2: Field names in where clauses
    const whereRegex = new RegExp(`(\\s+|{\\s*)${snakeCase}(\\s*:)`, "g");
    if (content.match(whereRegex)) {
      content = content.replace(whereRegex, `$1${camelCase}$2`);
      updated = true;
    }

    // Pattern 3: Field names in order_by clauses
    const orderByRegex = new RegExp(
      `(order_by:\\s*{\\s*)${snakeCase}(\\s*:)`,
      "g"
    );
    if (content.match(orderByRegex)) {
      content = content.replace(orderByRegex, `$1${camelCase}$2`);
      updated = true;
    }

    // Pattern 4: Nested object field references
    const nestedRegex = new RegExp(`(\\w+:\\s*)${snakeCase}(\\s*{)`, "g");
    if (content.match(nestedRegex)) {
      content = content.replace(nestedRegex, `$1${camelCase}$2`);
      updated = true;
    }
  }

  // Additional patterns for complex cases

  // Handle _not: { table_name: {} } patterns
  content = content.replace(
    /_not:\s*{\s*payroll_dates:/g,
    "_not: { payrollDates:"
  );

  // Handle aggregate patterns
  content = content.replace(/active_users:/g, "activeUsers:");

  if (content !== originalContent) {
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Updated ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed for ${filePath}`);
  }
}

// Main execution
function main() {
  console.log("🚀 Starting GraphQL camelCase conversion (Round 2)...\n");

  const graphqlFiles = getAllGraphQLFiles();
  console.log(`Found ${graphqlFiles.length} GraphQL files\n`);

  for (const file of graphqlFiles) {
    try {
      updateFile(file);
    } catch (error) {
      console.error(`❌ Error updating ${file}:`, error.message);
    }
  }

  console.log("\n✅ GraphQL camelCase conversion complete!");
  console.log("\n📝 Next steps:");
  console.log("1. Review the changes");
  console.log("2. Run: pnpm run codegen");
  console.log("3. Test the GraphQL operations");
}

if (require.main === module) {
  main();
}

module.exports = { fieldMappings, updateFile };
