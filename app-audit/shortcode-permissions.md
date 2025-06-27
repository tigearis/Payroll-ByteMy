Here’s a **complete, production-level documentation page** for your permission system using **separate category and verb tables (with shortcodes)**.
This structure keeps everything atomic, maintainable, and programmatically expandable.
It’s designed for technical onboarding, backend implementation, and audit readiness.

---

# 🏛️ ByteMy Unified Permission Shortcode System

## Overview

This document defines the **category–verb based permission model** for the ByteMy Payroll application.
All permissions are composed of a **category** and a **verb**, each with a unique shortcode, enabling a scalable, automatable, and secure access control system.
**Shortcodes** are used in JWTs and session variables for Clerk and Hasura, and only the mapping below should be maintained internally.

---

## 1. **Category Table**

| Category Name | Description                      | Shortcode |
| ------------- | -------------------------------- | --------- |
| Payroll       | Payroll operations               | `p`       |
| Staff         | Employee management              | `s`       |
| Client        | Client management                | `c`       |
| Admin         | Administrative/system management | `a`       |
| Settings      | System settings                  | `se`      |
| Billing       | Billing and payment              | `b`       |
| Security      | Security and access management   | `sec`     |
| Reports       | Reporting and analytics          | `r`       |
| Audit         | Audit logs and compliance        | `au`      |

---

## 2. **Verb Table**

| Verb Name   | Description                                     | Shortcode |
| ----------- | ----------------------------------------------- | --------- |
| create      | Create new resources                            | `c`       |
| read        | View or query data                              | `r`       |
| update      | Modify/edit existing resources                  | `u`       |
| delete      | Remove resources                                | `d`       |
| write       | Create and update resources (superset, if used) | `w`       |
| manage      | Full admin/control over resource                | `m`       |
| approve     | Approve workflows/tasks/changes                 | `ap`      |
| assign      | Assign resource/user responsibility             | `as`      |
| invite      | Invite users                                    | `i`       |
| archive     | Archive (mark as inactive, not delete)          | `ar`      |
| bulk_update | Mass/batch operations                           | `bu`      |
| export      | Export/download data                            | `e`       |
| schedule    | Set up recurring/future jobs                    | `sc`      |

---

## 3. **Permission Construction**

Each permission is constructed as `[category]:[verb]`, and the **shortcode** as `[category_shortcode][verb_shortcode]`.

**Example:**

| Category | Verb   | Permission String | Shortcode |
| -------- | ------ | ----------------- | --------- |
| Payroll  | read   | payroll\:read     | `pr`      |
| Staff    | update | staff\:update     | `su`      |
| Client   | delete | client\:delete    | `cd`      |
| Reports  | export | reports\:export   | `re`      |

---

## 4. **Role Shortcodes**

Roles are kept as a separate set of shortcodes, included in the same array for JWTs and Hasura checks.

| Role Name  | Description                  | Shortcode |
| ---------- | ---------------------------- | --------- |
| Developer  | Full system/developer access | `dev`     |
| Org Admin  | Org-wide admin               | `adm`     |
| Manager    | Manager/team lead            | `mgr`     |
| Consultant | Consultant/contractor        | `con`     |
| Viewer     | Read-only                    | `vw`      |

---

## 5. **Shortcode Array Usage**

- The **backend** calculates all role(s) and permissions, maps them to shortcodes, and produces an array.
- The **JWT** or Hasura session variable contains only the array, e.g.:

  ```json
  "x-hasura-permissions": ["mgr", "pr", "pw", "sr", "sw"]
  ```

  _(Manager role, payroll read/write, staff read/write)_

---

## 6. **Hasura Permission Checks**

- **Role-based access:**
  `{ "x-hasura-permissions": { "_has_keys_any": ["mgr", "adm", "dev"] } }`
- **Granular action:**
  `{ "x-hasura-permissions": { "_contains": ["pr"] } }` _(payroll read)_
- **Combined:**
  `{ "_and": [{ "x-hasura-permissions": { "_contains": ["pw"] } }, { "x-hasura-permissions": { "_has_keys_any": ["mgr", "adm", "dev"] } }] }`

---

## 7. **Extending the Model**

- **To add a new domain:**
  Add to the Category Table, pick a new unique shortcode.
- **To add a new action:**
  Add to the Verb Table, pick a new unique shortcode.
- **Permissions are the Cartesian product of Category × Verb.**

---

## 8. **Sample Full Permission Shortcode Table**

| Category Name | Category SC | Verb Name   | Verb SC | Permission String  | Shortcode |
| ------------- | ----------- | ----------- | ------- | ------------------ | --------- |
| Payroll       | p           | read        | r       | payroll\:read      | pr        |
| Payroll       | p           | write       | w       | payroll\:write     | pw        |
| Payroll       | p           | delete      | d       | payroll\:delete    | pd        |
| Payroll       | p           | assign      | as      | payroll\:assign    | pas       |
| Payroll       | p           | approve     | ap      | payroll\:approve   | pap       |
| Staff         | s           | read        | r       | staff\:read        | sr        |
| Staff         | s           | write       | w       | staff\:write       | sw        |
| Staff         | s           | delete      | d       | staff\:delete      | sd        |
| Staff         | s           | invite      | i       | staff\:invite      | si        |
| Staff         | s           | bulk_update | bu      | staff\:bulk_update | sbu       |
| Client        | c           | read        | r       | client\:read       | cr        |
| Client        | c           | write       | w       | client\:write      | cw        |
| Client        | c           | delete      | d       | client\:delete     | cd        |
| Client        | c           | archive     | ar      | client\:archive    | car       |
| Admin         | a           | manage      | m       | admin\:manage      | am        |
| Settings      | se          | write       | w       | settings\:write    | sew       |
| Billing       | b           | manage      | m       | billing\:manage    | bm        |
| Security      | sec         | read        | r       | security\:read     | secr      |
| Security      | sec         | write       | w       | security\:write    | secw      |
| Security      | sec         | manage      | m       | security\:manage   | secm      |
| Reports       | r           | read        | r       | reports\:read      | rr        |
| Reports       | r           | export      | e       | reports\:export    | re        |
| Reports       | r           | schedule    | sc      | reports\:schedule  | rsc       |
| Audit         | au          | read        | r       | audit\:read        | aur       |
| Audit         | au          | write       | w       | audit\:write       | auw       |
| Audit         | au          | export      | e       | audit\:export      | aue       |

---

## 9. **Backend Implementation Example**

```typescript
const CATEGORY = {
  payroll: "p",
  staff: "s",
  client: "c",
  admin: "a",
  settings: "se",
  billing: "b",
  security: "sec",
  reports: "r",
  audit: "au",
};

const VERB = {
  create: "c",
  read: "r",
  update: "u",
  write: "w",
  delete: "d",
  manage: "m",
  approve: "ap",
  assign: "as",
  invite: "i",
  archive: "ar",
  bulk_update: "bu",
  export: "e",
  schedule: "sc",
};

function permissionToShortcode(category, verb) {
  return CATEGORY[category] + VERB[verb];
}

// Example usage
permissionToShortcode("payroll", "read"); // 'pr'
permissionToShortcode("client", "delete"); // 'cd'
```

---

## 10. **Best Practices**

- Always use the verb table’s name/shortcode for each action across all categories.
- Never introduce new verbs just for one domain—keep the table universal.
- Only use the shortcodes in tokens/Hasura; keep full mapping internal.

---

## 11. **References**

- [Hasura Permissions Guide](https://hasura.io/docs/latest/auth/authorization/permission-rules/)
- [Clerk JWT Templates](https://clerk.com/docs/backend-requests/jwt-templates)

---

**This model ensures all permissions are predictable, maintainable, and easily extensible.
All access control logic is derived from the category and verb tables, and no internal mappings or descriptive names are ever exposed to the user or outside the backend.**
