## Executive summary

Payroll ByteMy is a secure, enterprise-grade payroll and workforce management platform for modern organizations. Built on Next.js 15, React 19, TypeScript, Hasura GraphQL, and Clerk, it delivers SOC2-aligned security, robust audit logging, and a five-tier role-based access control system. The product centralizes payroll processing, scheduling, time-off, tax calculation, reporting, documents, and approvals with a security-first, domain-driven architecture and an AI assistant that reduces errors and accelerates operations.

## Vision and mission

- **Mission**: Make payroll accurate, auditable, and effortless for security-conscious organizations.
- **Vision**: The most trusted, developer-friendly payroll OS that integrates seamlessly into modern data and identity stacks.

## Problem and opportunity

- **Complexity**: Payroll is complex, error-prone, and costly to audit across multiple roles, schedules, locations, and tax jurisdictions.
- **Legacy limitations**: Legacy systems are rigid; modern SaaS often under-delivers on auditability, integration, and security posture.
- **Opportunity**: A security-first, modular, GraphQL-native payroll platform with transparent auditability and AI-assisted operations.

## Solution overview

- Security-first payroll with end-to-end authentication, row-level security, explicit authorization, and immutable audit trails.
- Modular domain-driven design enabling extensibility without compromising compliance.
- Unified GraphQL access for data integrity, type safety, and high developer velocity.
- AI features for anomaly detection, natural-language reporting, and guided workflows.

## Target customers

- **Primary**: 20–500-employee professional services, agencies, consultancies, and tech companies requiring strong audit/compliance and flexible scheduling.
- **Secondary**: Multi-entity organizations, accountants/payroll bureaus serving multiple clients, and developer-first teams seeking GraphQL-native integration.

## Product overview (what the app shows)

- **Dashboard**: KPIs, upcoming payrolls, pending approvals, leave requests, alerts, and compliance status.
- **Payrolls**: Runs, drafts, approvals, status, gross-to-net breakdowns, adjustments, and pay slips.
- **Payroll schedule**: Calendars for pay frequencies, cutoff dates, and holidays.
- **Staff**: Employee directory, positions, compensation, bank details, and identity status.
- **Work schedule**: Shifts, rosters, overtime rules, and calendar views.
- **Leave**: Balances, accruals, requests, approvals, and policy configuration.
- **Tax calculator**: Country/state-specific calculators; scenario testing and validations.
- **Documents**: Contracts, payslips, compliance docs with access controls and retention policies.
- **Reports**: Standard and custom reports; export to CSV/PDF; scheduled delivery.
- **Admin/settings**: Roles, permissions, organization settings, billing, feature flags, and integrations.
- **Invitations**: Secure onboarding and role assignment with audit logging.
- **AI assistant**: Conversational insights, query data with natural language, suggest fixes, and generate reports.

## Core business logic

### Authentication and identity

- Native Clerk integration; never custom JWT handling. Server-side guards and component-level guards.
- Session claims drive authorization and organization scoping.

### Authorization and permissions

- Five-tier RBAC: developer, org_admin, manager, consultant, viewer.
- Permission checks at route, component, and database (RLS) layers.

### Payroll calculation engine

- Gross-to-net with configurable earnings, deductions, benefits, and taxes.
- Pro-rating for partial periods, retroactive adjustments, bonuses, and corrections.
- Multi-schedule (weekly/biweekly/semimonthly/monthly), cutoff logic, and approval gating.
- Policy rules per client/department/position; exception management for outliers.

### Leave and accruals

- Accrual policies, carryover rules, proration, negative balances, and blocking constraints.
- Approval workflows, calendar integration, payroll impact (unpaid vs paid leave).

### Scheduling and time

- Work schedules/rosters, overtime calculation rules, public holiday calendars, and shift differentials.

### Compliance and audit

- Immutable audit logs for user actions, data changes, approvals, and document access.
- PII controls, least-privilege access, and defensible retention policies.

### Reporting and exports

- Role-aware reports, drill-down to transactions, period comparisons, and anomaly flags.
- Export pipeline with watermarking and tamper-evident hashes for payslips (optional).

### Billing logic

- Per-employee-per-month base plus per-run or add-on modules (AI, analytics, archival).

## Feature set

### MVP (Weeks 0–12)

- Authentication and onboarding via Clerk.
- Organization, staff, positions, and bank details.
- Payroll schedules, draft/pay runs, and approvals.
- Leave policies, requests, and manager approvals.
- Basic tax calculator for a primary jurisdiction.
- Documents (upload, view, restricted access).
- Reporting: payroll summary, leave balances, headcount, cost by department.
- Audit logging across all sensitive actions.

### Advanced (Months 3–9)

- Multi-entity, multi-currency support.
- Advanced tax packs (additional countries/states).
- Time and attendance integrations (import shifts/timesheets).
- AI assistant for natural-language queries, anomaly detection, and guided workflows.
- Custom report builder and scheduled deliveries.
- Integration hub: accounting (e.g., QuickBooks/Xero), HRIS, banks, Slack/Email.
- Data retention policies and encrypted archives.
- Delegated admin and fine-grained permission editor.

### Enterprise (Months 9–12)

- SOC2 Type I/II readiness and evidence collection.
- SSO/SAML, SCIM provisioning.
- Advanced approvals (multi-level, dollar thresholds).
- Regional data residency and bring-your-own-key encryption (optional).
- Performance SLAs and premium support.

## Competitive landscape and differentiation

- **Competitors**: ADP, Gusto, Rippling, QuickBooks Payroll, Deel.
- **Differentiators**:
  - Security-first with three-layer auth (route, component, database) and pervasive audit trails.
  - GraphQL-native with type-safe, domain-driven architecture for extensibility.
  - AI assistant integrated with operational data for faster analysis and reduced errors.
  - Transparent permissioning with five-tier RBAC and RLS.
  - Developer-friendly integrations and event-driven export pipeline.

## Business model and pricing

### Pricing model

- Base: per-employee-per-month tiered by seat count.
- Usage: per payroll run or per generated pay slip.
- Add-ons: AI assistant, advanced analytics, additional tax jurisdictions, SSO/SCIM, data residency, premium support.

### Example tiers

- Starter: core payroll + leave + reports.
- Growth: adds scheduling, document workflows, custom reports.
- Enterprise: advanced security, integrations, SLAs, compliance add-ons.

## Go-to-market

- **ICP**: Security-conscious SMEs and multi-entity firms with compliance needs.
- **Channels**:
  - Product-led: self-serve onboarding, in-app trials, interactive demos.
  - Partner: accountants/outsourced payroll bureaus; systems integrators.
  - Integrations marketplace: accounting/HRIS/timekeeping partners.
- **Tactics**:
  - Compliance content (audit readiness guides), ROI calculators, and developer docs.
  - Webinars for payroll managers and accountants.
  - Targeted outbound to industries with complex schedules and strong audit needs.

## KPIs and success metrics

- **Product**: payroll error rate, time-to-run, approval cycle time, audit completion time, report generation latency.
- **Growth**: activation rate, D1/W1 retention, MRR/ARR, expansion revenue, NPS/CSAT.
- **Quality/Security**: incident count/MTTR, permission violations (blocked), audit coverage, test coverage.

## Security and compliance

- Authentication/identity: Clerk-native sessions; no custom token logic; automatic refresh.
- Authorization: five-tier RBAC; component guards and server validations; Hasura RLS.
- Data protection: encryption in transit/at rest, PII minimization, secrets management, least privilege.
- Audit logging: immutable logs for all sensitive actions; evidence reports for auditors.
- App security: Zod validation, CSRF protection, XSS prevention, no raw SQL; Hasura-only database access.
- Compliance roadmap: SOC2 Type I (months 3–6), Type II (months 9–12), DPA/records of processing.

## Technology and architecture (high level)

- Frontend: Next.js App Router, React 19, TypeScript; Tailwind + shadcn/ui.
- Identity: Clerk with role metadata and session claims.
- API/data: Hasura GraphQL Engine on PostgreSQL with RLS; unified Apollo client.
- Observability: structured logging, performance metrics, error boundaries and graceful error handling.
- Patterns: domain-driven design, strict type safety, server-side business logic, feature flags, and cache invalidation.

## Data model (simplified)

- **Core entities**: Organization, Client, Employee, Position, Payroll, PayrollSchedule, PayRun, Payslip, LeavePolicy, LeaveRequest, WorkSchedule, Shift, Document, Invitation, Permission, AuditEvent.
- **Relationships**:
  - Employee ↔ Position; Employee ↔ WorkSchedule; Employee → Payroll/Payslips; Employee → LeaveRequests.
  - PayrollSchedule → PayRun; PayRun → Payslips; LeavePolicy → LeaveRequests.
  - Organization/Client scopes everything; RLS enforces tenant isolation.

## Implementation plan and roadmap

- **Phase 1 (0–6 weeks)**: Core auth, org/staff, schedules, MVP payroll runs, leave requests, basic reports, audit foundation.
- **Phase 2 (6–12 weeks)**: Manager approvals, tax calculator v1, documents, export pipeline, billing, AI prototype.
- **Phase 3 (3–6 months)**: Integrations, custom reports, multi-entity/currency, AI anomaly detection, performance tuning.
- **Phase 4 (6–12 months)**: Enterprise security (SSO/SCIM), SOC2 Type I/II, regionalization, advanced approvals, SLAs.

## Risks and mitigations

- **Regulatory complexity**: partner with tax specialists; modular tax packs by jurisdiction.
- **Data security**: strict RBAC/RLS; penetration testing; continuous compliance monitoring.
- **Integration dependencies**: prioritize most common systems; robust webhooks and retries.
- **Adoption friction**: excellent onboarding, templates, and strong docs; import tools and sandbox mode.

## AI assistant capabilities

- Natural-language data exploration: “Show payroll variance month-over-month for Engineering.”
- Anomaly detection: flags outlier pay slips, missing approvals, or extreme variances.
- Guided workflows: contextual checklists during pay runs; explain calculations and policies.
- Report generation: draft board-ready summaries; scheduled delivery with role constraints.

## Services and support

- **Standard**: knowledge base, email support, in-app guides.
- **Premium**: dedicated CSM, implementation support, sandbox-to-prod migration, annual SOC reporting assistance.

## Financial outline (high level)

- **Revenue drivers**: PEPM subscriptions, payroll-run usage, AI/analytics add-ons, enterprise security add-ons.
- **Cost structure**: hosting (serverless + DB), support, compliance, tax content licensing, integrations maintenance, sales/marketing.
- **Unit economics goal**: >80% gross margin after year 1 with scalable infra and self-service onboarding.

## Exit opportunities

- Expand into broader HRIS/timekeeping or accounting workflow; or acquisition by payroll/HRIS vendors seeking modern, SOC2-aligned GraphQL-native platforms.

---

- **Key deliverables next**: finalize MVP scope, define pricing tiers, prioritize first three integrations, and stand up compliance program (SOC2 readiness, evidence collection, policy library).
- **12-month milestones**: MVP launch; SOC2 Type I; integrations + AI V1; SOC2 Type II and enterprise features.
- **Why we win**: security-first, auditable, developer-friendly payroll with real-time insights and AI that shortens close cycles and reduces errors.
- **Build posture**: domain-driven, type-safe, and strictly aligned with authentication/authorization best practices.
- **Outcome**: a trustworthy payroll platform that operators and auditors love, and developers can extend safely.
- **Go-to-market**: product-led plus partner-led with strong compliance-led content and integrations.
- **KPIs**: error rate <0.5%, approval cycle time <24h, NPS >50, MRR growth 15% MoM post-MVP.
- **Path to scale**: multi-entity/currency, enterprise controls, and an integration-first strategy.
- **Investment ask (if relevant)**: to accelerate tax content coverage, integrations, and SOC2 Type II.
- **Monetization**: PEPM + usage + enterprise security and AI add-ons.
- **Competitive moat**: end-to-end auditability, layered security, and a modern developer platform.
- **Team focus**: payroll operations excellence, compliance rigor, and delightful UX.
- **Roadmap confidence**: supported by the existing architecture and repo conventions.
- **Risk handling**: modularity, staged rollouts, and rigorous testing.
- **Customer promise**: accurate, secure, and explainable payroll—every run.
- **Scalability**: event-driven exports, GraphQL federation potential, and robust caching strategy.
