# UI Redesign Ticket Checklist

A structured, phase-based checklist to track the UI modernization effort. Use this as a source of truth and/or convert items into tickets. Link tickets back to this document.

- Source plan: `docs/ui/comprehensive-ui-redesign.md`
- Design tokens guide: `docs/ui/DESIGN_TOKEN_USAGE_GUIDE.md`

---

## How to use

- [ ] Assign an owner to each task (Owner: @username)
- [ ] Add estimates (Est: Xd)
- [ ] Link to PR/Issue when created (Link: #123)
- [ ] Update Status: Todo → In Progress → In Review → Done
- [ ] Ensure Definition of Done (DoD) is met for each task

DoD for all tasks:

- [ ] Accessible (keyboard, aria, contrast)
- [ ] Responsive (mobile/tablet/desktop)
- [ ] Tested (unit/smoke where applicable)
- [ ] Performance budget met
- [ ] Docs updated

---

## Phase 1: Foundation (Weeks 1–2)

- [ ] App Shell & Layout
  - [ ] Create `AppShell` primitives: `Header`, `Navigation`, `Main`, `PageContent` (Owner: ; Est: 2d; Link: )
  - [ ] Add `NotificationCenter` placeholder + events wiring (Owner: ; Est: 1d)
  - [ ] Implement `GlobalSearch` placeholder (cmdk or equivalent) (Owner: ; Est: 1d)
  - [ ] Responsive grid/layout utilities aligned to tokens (Owner: ; Est: 1d)

- [ ] Navigation System
  - [ ] Group routes into sections: Core, Operations, Business (Owner: ; Est: 0.5d)
  - [ ] Permission-aware rendering (re-use existing permission hooks) (Owner: ; Est: 0.5d)
  - [ ] Collapsible/compact nav states + persistence (Owner: ; Est: 1d)

- [ ] Page Header System
  - [ ] Build `PageHeader` component (title, description, breadcrumbs, actions, status, metadata) (Owner: ; Est: 1d)
  - [ ] Add examples to `app/(dashboard)/*` pages (Owner: ; Est: 1d)

- [ ] Tokens & Theming
  - [ ] Validate `lib/design-tokens/*` usage; extend spacing/typography as needed (Owner: ; Est: 0.5d)
  - [ ] Document layout breakpoints and type scale in `DESIGN_TOKEN_USAGE_GUIDE.md` (Owner: ; Est: 0.5d)

- [ ] Documentation
  - [ ] Add App Shell usage guide (Owner: ; Est: 0.5d)
  - [ ] Record architectural decisions (ADR): Navigation grouping and header system (Owner: ; Est: 0.5d)

---

## Phase 2: Core Pages (Weeks 3–5)

- [ ] Dashboard Redesign
  - [ ] Implement `StatusBar` (system health, alerts) (Owner: ; Est: 1d)
  - [ ] `QuickActions` (New Payroll, Import, Schedule) (Owner: ; Est: 1d)
  - [ ] `InsightsGrid` with `InsightCard` components (Owner: ; Est: 2d)
  - [ ] `WorkflowSuggestions` placeholder (AI hook integration later) (Owner: ; Est: 0.5d)

- [ ] Table System Modernization
  - [ ] New `DataTable` pattern with `TableToolbar` (search, simple filters, view toggle) (Owner: ; Est: 2d)
  - [ ] Essential columns only + `ExpandableRows` (Owner: ; Est: 1.5d)
  - [ ] `CardView` for mobile/tablet (Owner: ; Est: 1.5d)
  - [ ] Replace legacy `enhanced-unified-table.tsx` usage with new patterns (Owner: ; Est: 1d)

- [ ] Consistent Page Headers
  - [ ] Apply `PageHeader` across: Dashboard, Clients, Payrolls, Billing, Reports (Owner: ; Est: 1.5d)

- [ ] Docs & Examples
  - [ ] Add examples for table + card view patterns (Owner: ; Est: 0.5d)

---

## Phase 3: Domain Features (Weeks 6–8)

- [ ] Billing Workflow Interface
  - [ ] `BillingWorkspace` shell (Owner: ; Est: 0.5d)
  - [ ] `BillingOverview` (RevenueMetrics, PendingItems, RecentActivity) (Owner: ; Est: 1.5d)
  - [ ] `BillingActions` (Generate Invoice, Review Pending, Time Entry) (Owner: ; Est: 1d)
  - [ ] `BillingInsights` (RevenueChart, ClientPerformance) (Owner: ; Est: 1.5d)
  - [ ] Deprecate legacy complex billing tables (Owner: ; Est: 0.5d)

- [ ] Payroll Management (Calendar-based)
  - [ ] `PayrollCalendar` + `CalendarView` (month, week, timeline) (Owner: ; Est: 2d)
  - [ ] `PayrollFilters` (Client, Status, DateRange) (Owner: ; Est: 1d)
  - [ ] `PayrollSidebar` (UpcomingPayrolls, Alerts, QuickActions) (Owner: ; Est: 1d)
  - [ ] `PayrollDetails` (Summary, Tasks, Documents) (Owner: ; Est: 1.5d)

- [ ] Staff/Clients Core Flows
  - [ ] Modernize Staff list with table/card toggle (Owner: ; Est: 1d)
  - [ ] Modernize Clients list with table/card toggle (Owner: ; Est: 1d)

---

## Phase 4: Polish & Optimization (Weeks 9–10)

- [ ] Performance & Accessibility
  - [ ] Virtualization where needed (`@tanstack/react-virtual`) (Owner: ; Est: 1d)
  - [ ] A11y audit + fixes (Owner: ; Est: 1d)
  - [ ] Motion/animation pass (`framer-motion`) (Owner: ; Est: 1d)

- [ ] Responsive QA
  - [ ] Mobile/tablet/desktop QA sweep (Owner: ; Est: 1d)
  - [ ] Fixes from QA (Owner: ; Est: 1d)

- [ ] Testing & Docs
  - [ ] Add unit tests for new components (Owner: ; Est: 1d)
  - [ ] Update domain page READMEs with new patterns (Owner: ; Est: 0.5d)

---

## Cross-Cutting Tasks

- [ ] Command Palette
  - [ ] Implement `cmdk`-based command palette (Owner: ; Est: 1d)
  - [ ] Add common actions (navigate, search, new item) (Owner: ; Est: 0.5d)

- [ ] Feature Flags
  - [ ] Wrap major new UI behind feature flags (Owner: ; Est: 0.5d)

- [ ] Docs Index
  - [ ] Add links from `docs/README.md` to redesign docs (Owner: ; Est: 0.25d)

---

## Cleanup (remove/replace legacy)

- [ ] Remove legacy components (after migration):
  - [ ] `components/ui/enhanced-unified-table.tsx` (Owner: ; Est: 0.25d)
  - [ ] Any `*-table-original-backup.tsx` variants (Owner: ; Est: 0.25d)
  - [ ] Deprecated filtering UIs replaced by `TableToolbar` (Owner: ; Est: 0.25d)

---

## Sign-offs

- [ ] Design Lead review complete (Owner: ; Link: )
- [ ] Engineering Lead review complete (Owner: ; Link: )
- [ ] Security/accessibility review complete (Owner: ; Link: )
- [ ] Stakeholder demo complete (Owner: ; Link: )

---

## Appendix: Issue Template (copy/paste)

```
Title: [Phase X] <Feature/Component> – <Action>

Summary
- Implement <what> as part of Phase X of the UI redesign.

Scope
- Files: <paths>
- Affects: <pages/components>

Acceptance Criteria
- [ ] Accessible (keyboard, aria, contrast)
- [ ] Responsive (mobile/tablet/desktop)
- [ ] Tests added/updated
- [ ] Performance budget met
- [ ] Documentation updated

Owner: @
Estimation: Xd
Dependencies: <links>
Links: Design – PR – Parent Epic
Status: Todo
```
