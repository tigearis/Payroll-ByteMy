xCertainly. Here’s a **comprehensive technical report** summarising your current advanced payroll scheduler requirements, the current and proposed database schemas, technical challenges, and the exact, recommended, non-breaking changes to deliver a robust, scalable, and foolproof solution. This is suitable for technical handover, architecture review, or implementation planning.

---

# **Advanced Payroll Scheduler – Full Architecture Review and Migration Plan**

## **1. Project Overview**

You are building an advanced drag-and-drop payroll scheduling system for ByteMy, supporting:

- Calendar/grid visualisation of payroll assignments (by consultant, date, period)
- Drag-and-drop reassignment of payroll processing (single instance or group)
- Live vs. preview state with ghost/visual feedback
- Full leave, holiday, backup assignment logic
- Bulk movement, consultant workload metrics, holiday adjustments

The current code base, API, and database were analysed for gaps and possible failure modes.

---

## **2. Current Database Schema – Key Features and Limitations**

**Relevant tables (all in schema `public`):**

- `payrolls`: Core payroll records; assigns a single primary and backup consultant per payroll.
- `payroll_dates`: Each payroll’s individual scheduled run dates (EFT, adjustment, etc).
- `users`: Consultants and users with RBAC and metadata.
- `leaves`: Consultant leave periods.
- `holidays`: Public/regional holidays.
- (Various reference tables: `payroll_cycles`, `payroll_date_types`, etc.)

### **Limitation:**

- **Assignment is per-payroll, not per-payroll-date.**

  - You cannot, in a scalable way, assign or reassign a consultant for a specific payroll run (i.e., “move this week’s payroll to Jane, but keep future dates with Tom”).
  - Any reassignment of a consultant applies to all instances.

- The UI logic is forced to “simulate” per-date assignment by comparing dates, consultants, and ad hoc business logic, making the scheduler complex, fragile, and unable to track historical changes or backup overrides robustly.

---

## **3. Requirements for Robust Scheduler**

Your scheduler needs the ability to:

- Assign **each payroll run (by date) to a specific consultant**, supporting overrides and backups.
- Handle drag-and-drop operations cleanly (single instance and group move).
- Track and audit exactly who is/was responsible for each payroll processing event.
- Block or warn about invalid assignments (leave, backup, holiday).

---

## **4. Recommended Schema Extension**

### **Introduce: `payroll_assignments` Table**

A new table links each `payroll_date` to the _actual_ assigned consultant (defaulting to the payroll’s primary consultant, unless overridden).

#### **DDL:**

```sql
CREATE TABLE public.payroll_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_date_id uuid NOT NULL REFERENCES public.payroll_dates(id) ON DELETE CASCADE,
    assigned_consultant_id uuid NOT NULL REFERENCES public.users(id),
    is_backup boolean DEFAULT false,
    original_consultant_id uuid REFERENCES public.users(id),
    assigned_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(payroll_date_id)
);

CREATE INDEX idx_assignments_consultant_id ON public.payroll_assignments(assigned_consultant_id);
CREATE INDEX idx_assignments_payroll_date_id ON public.payroll_assignments(payroll_date_id);
```

**Rationale:**

- Assignment can be overridden per run/date.
- Supports history (audit, versioning possible).
- Only one consultant is responsible for a given payroll date—enforced by a unique constraint.
- Future-proof: supports backup, leave, group and individual reassignment.

---

## **5. Migration Path**

### **Backfill Existing Data**

For every row in `payroll_dates`, create a default assignment to the current `primary_consultant_id`:

```sql
INSERT INTO public.payroll_assignments (payroll_date_id, assigned_consultant_id, original_consultant_id)
SELECT pd.id, p.primary_consultant_id, p.primary_consultant_id
FROM public.payroll_dates pd
JOIN public.payrolls p ON p.id = pd.payroll_id
WHERE p.primary_consultant_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM public.payroll_assignments pa WHERE pa.payroll_date_id = pd.id
  );
```

- **Safe for rerun**—won’t duplicate assignments.

### **Maintain Dual-Read**

- Keep `primary_consultant_id`/`backup_consultant_id` on `payrolls` for legacy code.
- App reads from `payroll_assignments` where available, falling back to `payrolls` if not (transition period only).

---

## **6. GraphQL and API Changes**

### **Extend GraphQL Types:**

```graphql
type PayrollAssignment {
  id: ID!
  payroll_date_id: ID!
  assigned_consultant_id: ID!
  is_backup: Boolean
  original_consultant_id: ID
  assigned_at: timestamptz
  updated_at: timestamptz
  payroll_date: PayrollDate!
  consultant: User!
}

extend type PayrollDate {
  assignment: PayrollAssignment
}
```

### **Mutation for Assignment Change:**

```graphql
input PayrollAssignmentInput {
  payroll_date_id: ID!
  from_consultant_id: ID!
  to_consultant_id: ID!
  is_backup: Boolean
}

type Mutation {
  commitPayrollAssignments(
    changes: [PayrollAssignmentInput!]!
  ): PayrollAssignmentResponse!
}
```

- All drag-and-drop changes are submitted as `PayrollAssignmentInput[]`.
- Group moves = batch; single = single; both atomic.

---

## **7. Frontend and Application Logic Changes**

### **What Needs Refactor:**

- **Fetch:** Use assignments by date, not payroll-wide.
- **Move:** When a user drags a payroll, update the assignment (not the payroll’s consultant).
- **Preview/Ghost Logic:** Use assignment records for diffing between live/preview.
- **Consultant Workload:** Count by assignments, not by payrolls.
- **Leave/Backup:** Systematically check assignment and backup on a per-date basis.

### **Transitional Safeguards**

- UI: If assignment missing, fallback to payroll’s primary/backup consultant for that date.
- API: No breaking changes for legacy code; new endpoints can be phased in.

---

## **8. Non-Breaking Rollout Checklist**

| Step | Action                                          | Affects  | Breaking?                          |
| ---- | ----------------------------------------------- | -------- | ---------------------------------- |
| 1    | Create new table (`public.payroll_assignments`) | DB       | No                                 |
| 2    | Backfill data from `payrolls` to new table      | DB       | No                                 |
| 3    | Expose assignments in API/GraphQL               | Backend  | No                                 |
| 4    | Update UI/React to use new model for schedule   | Frontend | No                                 |
| 5    | Continue dual-read (assignments + legacy)       | App      | No                                 |
| 6    | Remove legacy consultant fields (final step)    | App/DB   | Yes, only after all usage migrated |

---

## **9. Benefits of This Model**

- **Granular control:** Per-date/per-run assignment and tracking.
- **Robustness:** No accidental double-assignment, no fragile simulation logic in frontend.
- **Auditability:** Full trace of who is (or was) responsible for each run.
- **Extensibility:** Supports future leave, backup, audit, reporting, and even multi-assignee if required.

---

## **10. Optional Improvements**

- **Assignment history table**: For full audit/versioned rollbacks.
- **Automatic leave reassignment**: Triggers can auto-reassign based on leave records.
- **Full batch import/export:** For bulk admin changes or reconciliation.

---

## **11. Migration Rollback Plan (if needed)**

- If problems arise, simply drop the new `payroll_assignments` table and remove frontend changes; old system is untouched during rollout.

---

## **12. Key SQL/Implementation Snippets**

- Table DDL: (see above, `public` schema)
- Backfill: (see above)
- GraphQL types: (see above)
- Mutation input/output: (see above)

---

## **13. Immediate Next Actions**

1. **Create `payroll_assignments` table in `public` schema.**
2. **Backfill data from current payrolls.**
3. **Update Hasura/GraphQL types to include assignments.**
4. **Update React components to use assignment data for display, drag/move, ghost logic.**
5. **Roll out incrementally—no breaking change to existing business logic.**

---

## **14. Technical Owner Notes**

- All work has been designed to avoid downtime and dual-run both systems during migration.
- No field or table is dropped or changed until all business logic and screens have been migrated.
- This model is in line with best-practice SaaS scheduling and auditability.

---

# **End of Report**

**Appendix:**

- SQL migration, backfill, and example Hasura relationship snippets are available on request.
- Ready to assist with code review, testing, or phased deployment support.

---

**If you require the final SQL, GraphQL SDL, or React code samples, please confirm and provide your current GraphQL API/Hasura setup for targeted snippets.**
