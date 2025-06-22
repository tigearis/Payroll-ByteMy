# Comprehensive Customization & Extension Guide - Payroll Matrix

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Domain-Driven Customization](#domain-driven-customization)
3. [Authentication & Authorization Extensions](#authentication--authorization-extensions)
4. [UI Component Customization](#ui-component-customization)
5. [GraphQL Schema Extensions](#graphql-schema-extensions)
6. [Business Logic Customization](#business-logic-customization)
7. [API Extensions](#api-extensions)
8. [Database Schema Extensions](#database-schema-extensions)
9. [Integration Extensions](#integration-extensions)
10. [Theming & Styling](#theming--styling)
11. [Plugin Architecture](#plugin-architecture)
12. [Configuration Management](#configuration-management)

---

## System Architecture Overview

### Customization Philosophy

Payroll Matrix is built with extensibility as a core principle, following these architectural patterns:

- **Domain-Driven Design (DDD)**: Each business domain is isolated and extensible
- **Modular Architecture**: Components and services are loosely coupled
- **Configuration-Driven**: Behavior controlled through configuration
- **Plugin-Ready**: Extension points throughout the system
- **Type-Safe Extensions**: TypeScript ensures extension compatibility

### Extension Points

```typescript
// Core extension interfaces
interface SystemExtension {
  name: string;
  version: string;
  dependencies?: string[];
  install(): Promise<void>;
  uninstall(): Promise<void>;
  configure(config: ExtensionConfig): void;
}

interface DomainExtension extends SystemExtension {
  domain: string;
  graphqlTypes?: string;
  components?: ComponentMap;
  apiRoutes?: RouteDefinition[];
}
```

---

## Domain-Driven Customization

### Creating Custom Domains

#### 1. Domain Structure

```
domains/
└── custom-domain/
    ├── components/          # React components
    │   ├── custom-list.tsx
    │   └── custom-form.tsx
    ├── graphql/            # GraphQL operations
    │   ├── queries.graphql
    │   └── mutations.graphql
    ├── generated/          # Auto-generated types
    │   └── graphql.generated.ts
    ├── hooks/             # Custom React hooks
    │   └── use-custom-data.ts
    ├── types/             # TypeScript definitions
    │   └── custom.types.ts
    ├── services/          # Business logic
    │   └── custom.service.ts
    └── index.ts           # Domain exports
```

#### 2. Domain Registration

```typescript
// domains/custom-domain/index.ts
import { DomainExtension } from "@/shared/types/extensions";

export const CustomDomainExtension: DomainExtension = {
  name: "custom-domain",
  version: "1.0.0",
  domain: "custom",

  async install() {
    // Register GraphQL operations
    await registerGraphQLOperations("./graphql/**/*.graphql");

    // Register API routes
    await registerApiRoutes("./api/**/*.ts");

    // Register components
    await registerComponents({
      CustomList: () => import("./components/custom-list"),
      CustomForm: () => import("./components/custom-form"),
    });
  },

  configure(config) {
    // Domain-specific configuration
    this.config = config;
  },
};

// Register domain
registerDomain(CustomDomainExtension);
```

#### 3. GraphQL Schema Extension

```graphql
# domains/custom-domain/graphql/schema.graphql
extend type Query {
  customEntities(
    where: CustomEntityFilter
    limit: Int
    offset: Int
  ): [CustomEntity!]!
}

extend type Mutation {
  createCustomEntity(input: CreateCustomEntityInput!): CustomEntity!
  updateCustomEntity(id: UUID!, input: UpdateCustomEntityInput!): CustomEntity!
  deleteCustomEntity(id: UUID!): Boolean!
}

type CustomEntity {
  id: UUID!
  name: String!
  description: String
  customField1: String
  customField2: Int
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CreateCustomEntityInput {
  name: String!
  description: String
  customField1: String
  customField2: Int
}
```

---

## Authentication & Authorization Extensions

### Custom Role Types

#### 1. Extending Role System

```typescript
// types/auth-extensions.ts
export enum CustomRole {
  CUSTOM_ADMIN = "custom_admin",
  CUSTOM_USER = "custom_user",
  EXTERNAL_AUDITOR = "external_auditor",
}

// Extend base role hierarchy
export const EXTENDED_ROLE_HIERARCHY = {
  ...ROLE_HIERARCHY,
  [CustomRole.CUSTOM_ADMIN]: 6,
  [CustomRole.EXTERNAL_AUDITOR]: 2,
  [CustomRole.CUSTOM_USER]: 1,
};
```

#### 2. Custom Permission System

```typescript
// lib/auth/custom-permissions.ts
export const CUSTOM_PERMISSIONS = {
  CUSTOM_ENTITY: {
    CREATE: "custom_entity:create",
    READ: "custom_entity:read",
    UPDATE: "custom_entity:update",
    DELETE: "custom_entity:delete",
    AUDIT: "custom_entity:audit",
  },
  EXTERNAL_AUDIT: {
    READ_ALL: "external_audit:read_all",
    EXPORT_DATA: "external_audit:export_data",
  },
} as const;

// Custom permission checker
export class CustomPermissionChecker extends BasePermissionChecker {
  canAccessCustomEntity(action: string, entityId?: string): boolean {
    if (!this.hasPermission(CUSTOM_PERMISSIONS.CUSTOM_ENTITY[action])) {
      return false;
    }

    // Additional business logic
    if (entityId && action === "DELETE") {
      return this.hasRole(CustomRole.CUSTOM_ADMIN);
    }

    return true;
  }
}
```

#### 3. Custom Authentication Flow

```typescript
// lib/auth/custom-auth-flow.ts
export class CustomAuthFlow {
  async authenticateExternalUser(token: string): Promise<User | null> {
    // Custom authentication logic for external systems
    const externalUser = await validateExternalToken(token);

    if (!externalUser) return null;

    // Map external user to internal user
    return {
      id: `ext_${externalUser.id}`,
      email: externalUser.email,
      role: CustomRole.EXTERNAL_AUDITOR,
      permissions: [
        CUSTOM_PERMISSIONS.EXTERNAL_AUDIT.READ_ALL,
        CUSTOM_PERMISSIONS.EXTERNAL_AUDIT.EXPORTdata,
      ],
    };
  }
}
```

---

## UI Component Customization

### Component Extension System

#### 1. Base Component Extension

```typescript
// components/extensions/base-extension.tsx
export interface ComponentExtension<T = any> {
  name: string;
  version: string;
  extends?: string;
  props?: T;
  render(props: T): React.ReactElement;
  configure?(config: ComponentConfig): void;
}

export function createComponentExtension<T>(
  extension: ComponentExtension<T>
): React.FC<T> {
  return function ExtendedComponent(props: T) {
    const baseComponent = extension.extends
      ? getBaseComponent(extension.extends)
      : null;

    if (baseComponent && extension.render) {
      return extension.render(props);
    }

    return baseComponent ? baseComponent(props) : null;
  };
}
```

#### 2. Custom Dashboard Widget

```typescript
// components/dashboard/custom-widget.tsx
import { DashboardWidget } from '@/components/dashboard/base-widget';

interface CustomWidgetProps {
  title: string;
  data: any[];
  refreshInterval?: number;
}

export const CustomWidget: React.FC<CustomWidgetProps> = ({
  title,
  data,
  refreshInterval = 30000,
}) => {
  const [customData, setCustomData] = useState(data);

  useEffect(() => {
    const interval = setInterval(async () => {
      const freshData = await fetchCustomData();
      setCustomData(freshData);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <DashboardWidget title={title}>
      <div className="custom-widget">
        {customData.map((item, index) => (
          <CustomWidgetItem key={index} item={item} />
        ))}
      </div>
    </DashboardWidget>
  );
};

// Register widget
registerDashboardWidget('custom-widget', CustomWidget, {
  roles: [CustomRole.CUSTOM_ADMIN, 'admin'],
  permissions: [CUSTOM_PERMISSIONS.CUSTOM_ENTITY.READ],
});
```

#### 3. Custom Form Components

```typescript
// components/forms/custom-form-fields.tsx
export const CustomFormFields = {
  // Custom date picker with business day validation
  BusinessDatePicker: ({ value, onChange, ...props }) => (
    <DatePicker
      value={value}
      onChange={onChange}
      filterDate={isBusinessDay}
      {...props}
    />
  ),

  // Custom consultant selector with workload indication
  ConsultantSelector: ({ value, onChange, showWorkload = true }) => {
    const { consultants, workload } = useConsultantsWithWorkload();

    return (
      <Select value={value} onValueChange={onChange}>
        {consultants.map(consultant => (
          <SelectItem key={consultant.id} value={consultant.id}>
            <div className="flex justify-between">
              <span>{consultant.name}</span>
              {showWorkload && (
                <span className="text-sm text-gray-500">
                  {workload[consultant.id]}% capacity
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </Select>
    );
  },

  // Custom frequency selector with preview
  FrequencySelector: ({ value, onChange, previewDates = true }) => {
    const [preview, setPreview] = useState<Date[]>([]);

    useEffect(() => {
      if (previewDates && value) {
        const dates = generatePreviewDates(value);
        setPreview(dates.slice(0, 5)); // Show first 5 dates
      }
    }, [value, previewDates]);

    return (
      <div>
        <Select value={value} onValueChange={onChange}>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="fortnightly">Fortnightly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </Select>

        {previewDates && preview.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            <strong>Preview dates:</strong>
            {preview.map((date, i) => (
              <span key={i}>
                {format(date, 'dd/MM/yyyy')}
                {i < preview.length - 1 ? ', ' : '...'}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  },
};
```

---

## GraphQL Schema Extensions

### Custom Schema Development

#### 1. Schema Extension Pattern

```typescript
// graphql/extensions/custom-schema.ts
export const CustomSchemaExtension = gql`
  extend type User {
    customProfile: CustomProfile
    customSettings: CustomSettings
  }

  extend type Client {
    customFields: CustomClientFields
    integrations: [Integration!]!
  }

  extend type Payroll {
    customConfiguration: CustomPayrollConfig
    complianceSettings: ComplianceSettings
  }

  type CustomProfile {
    department: String
    costCenter: String
    customAttributes: JSON
  }

  type Integration {
    id: UUID!
    type: IntegrationType!
    status: IntegrationStatus!
    config: JSON!
    lastSync: DateTime
  }

  enum IntegrationType {
    PAYROLL_SYSTEM
    TIME_TRACKING
    HR_SYSTEM
    ACCOUNTING
  }
`;
```

#### 2. Custom Resolvers

```typescript
// graphql/resolvers/custom-resolvers.ts
export const CustomResolvers: Resolvers = {
  User: {
    customProfile: async (user, args, context) => {
      return await context.dataSources.customProfileAPI.getByUserId(user.id);
    },
  },

  Client: {
    integrations: async (client, args, context) => {
      return await context.dataSources.integrationAPI.getByClientId(client.id);
    },
  },

  Mutation: {
    createCustomEntity: async (_, { input }, context) => {
      // Validate permissions
      await context.auth.requirePermission(
        CUSTOM_PERMISSIONS.CUSTOM_ENTITY.CREATE
      );

      // Business logic
      const entity = await context.dataSources.customEntityAPI.create(input);

      // Audit logging
      await context.audit.log({
        action: "create_custom_entity",
        resourceType: "custom_entity",
        resourceId: entity.id,
        newValues: input,
      });

      return entity;
    },

    syncIntegration: async (_, { integrationId }, context) => {
      const integration =
        await context.dataSources.integrationAPI.getById(integrationId);

      if (!integration) {
        throw new Error("Integration not found");
      }

      // Custom sync logic based on integration type
      const syncResult = await performIntegrationSync(integration);

      return {
        success: syncResult.success,
        message: syncResult.message,
        syncedRecords: syncResult.recordCount,
      };
    },
  },

  Subscription: {
    customEntityUpdated: {
      subscribe: (_, args, context) => {
        return context.pubsub.subscribe(
          `CUSTOM_ENTITY_UPDATED:${args.entityId}`
        );
      },
    },
  },
};
```

#### 3. Custom Data Sources

```typescript
// graphql/datasources/custom-entity-api.ts
export class CustomEntityAPI extends DataSource {
  constructor(private db: DatabaseConnection) {
    super();
  }

  async getByUserId(userId: string): Promise<CustomEntity[]> {
    return this.db.customEntity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(input: CreateCustomEntityInput): Promise<CustomEntity> {
    return this.db.customEntity.create({
      data: {
        ...input,
        id: generateUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async update(
    id: string,
    input: UpdateCustomEntityInput
  ): Promise<CustomEntity> {
    return this.db.customEntity.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date(),
      },
    });
  }
}
```

---

## Business Logic Customization

### Custom Calculation Engines

#### 1. Tax Calculation Extension

```typescript
// lib/calculations/custom-tax-calculator.ts
export class CustomTaxCalculator extends BaseTaxCalculator {
  calculateCustomTax(income: number, jurisdiction: string): TaxResult {
    const baseResult = super.calculateIncomeTax(income);

    // Add custom tax calculations
    const customTax = this.calculateCustomJurisdictionTax(income, jurisdiction);

    return {
      ...baseResult,
      customTax: customTax.amount,
      totalTax: baseResult.totalTax + customTax.amount,
      breakdown: [
        ...baseResult.breakdown,
        {
          name: `Custom ${jurisdiction} Tax`,
          rate: customTax.rate,
          amount: customTax.amount,
        },
      ],
    };
  }

  private calculateCustomJurisdictionTax(income: number, jurisdiction: string) {
    const config = this.getCustomTaxConfig(jurisdiction);

    if (!config) {
      return { amount: 0, rate: 0 };
    }

    // Progressive tax calculation
    let tax = 0;
    let remainingIncome = income;

    for (const bracket of config.brackets) {
      if (remainingIncome <= 0) break;

      const taxableAmount = Math.min(
        remainingIncome,
        bracket.limit - bracket.threshold
      );
      tax += taxableAmount * bracket.rate;
      remainingIncome -= taxableAmount;
    }

    return {
      amount: Math.round(tax * 100) / 100,
      rate: tax / income,
    };
  }
}
```

#### 2. Custom Payroll Rules Engine

```typescript
// lib/payroll/custom-rules-engine.ts
export class CustomPayrollRulesEngine {
  private rules: PayrollRule[] = [];

  addRule(rule: PayrollRule): void {
    this.rules.push(rule);
  }

  async processPayroll(payroll: Payroll): Promise<PayrollResult> {
    const context = new PayrollContext(payroll);

    // Apply all rules in priority order
    const sortedRules = this.rules.sort((a, b) => a.priority - b.priority);

    for (const rule of sortedRules) {
      if (await rule.condition(context)) {
        await rule.action(context);
      }
    }

    return context.getResult();
  }
}

// Example custom rules
export const CustomPayrollRules = {
  // Rule: Auto-assign backup consultant when primary is on leave
  autoBackupAssignment: {
    name: "Auto Backup Assignment",
    priority: 100,
    condition: async context => {
      const consultant = await context.getPrimaryConsultant();
      return await consultant.isOnLeave(context.payroll.processingDate);
    },
    action: async context => {
      const backupConsultant = await context.getBackupConsultant();
      if (backupConsultant) {
        context.assignConsultant(backupConsultant.id, true);
        context.addNote(
          `Primary consultant on leave, assigned backup: ${backupConsultant.name}`
        );
      }
    },
  },

  // Rule: Require manager approval for high-value payrolls
  managerApprovalRequired: {
    name: "Manager Approval Required",
    priority: 200,
    condition: async context => {
      return context.payroll.employeeCount > 100;
    },
    action: async context => {
      context.requireApproval(context.payroll.managerId);
      context.addNote("Manager approval required for large payroll");
    },
  },
};
```

---

## API Extensions

### Custom API Routes

#### 1. REST API Extension

```typescript
// app/api/custom/entities/route.ts
import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";
import { CustomEntityService } from "@/services/custom-entity.service";

export const GET = withAuth(
  async (request: NextRequest, session) => {
    const url = new URL(request.url);
    const filters = {
      search: url.searchParams.get("search"),
      category: url.searchParams.get("category"),
      status: url.searchParams.get("status"),
    };

    const service = new CustomEntityService();
    const entities = await service.getEntities(filters, session.userId);

    return Response.json({
      entities,
      pagination: service.getPaginationInfo(),
    });
  },
  {
    allowedRoles: ["custom_admin", "admin"],
    permissions: [CUSTOM_PERMISSIONS.CUSTOM_ENTITY.READ],
  }
);

export const POST = withAuth(
  async (request: NextRequest, session) => {
    const body = await request.json();

    // Validate input
    const validatedInput = await validateCustomEntityInput(body);

    const service = new CustomEntityService();
    const entity = await service.createEntity(validatedInput, session.userId);

    return Response.json({ entity }, { status: 201 });
  },
  {
    allowedRoles: ["custom_admin", "admin"],
    permissions: [CUSTOM_PERMISSIONS.CUSTOM_ENTITY.CREATE],
  }
);
```

#### 2. GraphQL API Extension

```typescript
// app/api/graphql/custom-schema.ts
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";

const customTypeDefs = `
  extend type Query {
    customDashboardStats: CustomDashboardStats!
    customReports(type: String!, dateRange: DateRangeInput): [CustomReport!]!
  }
  
  extend type Mutation {
    generateCustomReport(input: CustomReportInput!): CustomReportResult!
    scheduleCustomTask(input: ScheduleTaskInput!): ScheduledTask!
  }
  
  type CustomDashboardStats {
    totalCustomEntities: Int!
    activeIntegrations: Int!
    pendingTasks: Int!
    lastSyncTime: DateTime
  }
`;

const customResolvers = {
  Query: {
    customDashboardStats: async (_, __, context) => {
      const stats = await context.dataSources.customAPI.getDashboardStats();
      return stats;
    },
  },

  Mutation: {
    generateCustomReport: async (_, { input }, context) => {
      // Validate permissions
      await context.auth.requirePermission("custom_reports:generate");

      // Generate report
      const reportService = new CustomReportService();
      const report = await reportService.generate(input);

      return {
        success: true,
        reportId: report.id,
        downloadUrl: report.downloadUrl,
      };
    },
  },
};

export const customSchema = makeExecutableSchema({
  typeDefs: customTypeDefs,
  resolvers: customResolvers,
});
```

---

## Database Schema Extensions

### Custom Tables and Relationships

#### 1. Database Migration for Custom Tables

```sql
-- migrations/001_add_custom_entities.sql
CREATE TABLE custom_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    custom_data JSONB DEFAULT '{}',
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, owner_id)
);

CREATE TABLE custom_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    integration_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',
    config JSONB NOT NULL DEFAULT '{}',
    credentials JSONB DEFAULT '{}',
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE custom_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- Indexes for performance
CREATE INDEX idx_custom_entities_owner ON custom_entities(owner_id);
CREATE INDEX idx_custom_entities_category ON custom_entities(category);
CREATE INDEX idx_custom_integrations_client ON custom_integrations(client_id);
CREATE INDEX idx_custom_audit_entity ON custom_audit_logs(entity_type, entity_id);

-- RLS policies
ALTER TABLE custom_entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY custom_entities_owner_policy ON custom_entities
    FOR ALL USING (
        owner_id = current_setting('hasura.user_id')::UUID OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = current_setting('hasura.user_id')::UUID
            AND role IN ('admin', 'custom_admin')
        )
    );
```

#### 2. Hasura Metadata for Custom Tables

```yaml
# hasura/metadata/tables.yaml
- table:
    name: custom_entities
    schema: public
  configuration:
    column_config:
      custom_data:
        custom_name: customData
      owner_id:
        custom_name: ownerId
    custom_column_names:
      created_at: createdAt
      updated_at: updatedAt
  object_relationships:
    - name: owner
      using:
        foreign_key_constraint_on: owner_id
  array_relationships:
    - name: auditLogs
      using:
        manual_configuration:
          column_mapping:
            id: entity_id
          insertion_order: null
          remote_table:
            name: custom_audit_logs
            schema: public
  select_permissions:
    - role: custom_admin
      permission:
        columns: "*"
        filter: {}
    - role: custom_user
      permission:
        columns: "*"
        filter:
          owner_id:
            _eq: X-Hasura-User-Id
```

---

## Integration Extensions

### Third-Party System Integration

#### 1. Payroll System Integration

```typescript
// integrations/payroll-systems/custom-payroll-system.ts
export class CustomPayrollSystemIntegration
  implements PayrollSystemIntegration
{
  private config: PayrollSystemConfig;
  private client: CustomPayrollAPIClient;

  constructor(config: PayrollSystemConfig) {
    this.config = config;
    this.client = new CustomPayrollAPIClient(config.credentials);
  }

  async syncEmployees(clientId: string): Promise<SyncResult> {
    try {
      const employees = await this.client.getEmployees();
      const syncResults = [];

      for (const employee of employees) {
        const mappedEmployee = this.mapEmployeeData(employee);
        const result = await this.upsertEmployee(clientId, mappedEmployee);
        syncResults.push(result);
      }

      return {
        success: true,
        recordsProcessed: employees.length,
        recordsUpdated: syncResults.filter(r => r.updated).length,
        recordsCreated: syncResults.filter(r => r.created).length,
        errors: syncResults.filter(r => r.error).map(r => r.error),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async exportPayrollData(payrollId: string): Promise<ExportResult> {
    const payroll = await this.getPayrollData(payrollId);
    const formattedData = this.formatForCustomSystem(payroll);

    try {
      const result = await this.client.createPayrollRun(formattedData);

      return {
        success: true,
        externalId: result.payrollRunId,
        exportedAt: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private mapEmployeeData(externalEmployee: any): Employee {
    return {
      externalId: externalEmployee.id,
      firstName: externalEmployee.first_name,
      lastName: externalEmployee.last_name,
      email: externalEmployee.email,
      employeeNumber: externalEmployee.employee_number,
      department: externalEmployee.department,
      position: externalEmployee.position,
      salary: parseFloat(externalEmployee.annual_salary),
      startDate: new Date(externalEmployee.start_date),
    };
  }
}
```

#### 2. HR System Integration

```typescript
// integrations/hr-systems/custom-hr-integration.ts
export class CustomHRIntegration {
  async syncUserData(): Promise<void> {
    const hrUsers = await this.fetchHRUsers();

    for (const hrUser of hrUsers) {
      const existingUser = await this.findUserByEmail(hrUser.email);

      if (existingUser) {
        await this.updateUserFromHR(existingUser, hrUser);
      } else {
        await this.createUserFromHR(hrUser);
      }
    }
  }

  async syncOrganizationalStructure(): Promise<void> {
    const departments = await this.fetchDepartments();
    const positions = await this.fetchPositions();

    await this.updateDepartmentStructure(departments);
    await this.updatePositionHierarchy(positions);
  }

  private async createUserFromHR(hrUser: HRUser): Promise<void> {
    // Create invitation in Clerk
    const invitation = await clerk.users.createUser({
      emailAddress: hrUser.email,
      firstName: hrUser.firstName,
      lastName: hrUser.lastName,
      publicMetadata: {
        role: this.mapHRRoleToSystemRole(hrUser.role),
        department: hrUser.department,
        employeeNumber: hrUser.employeeNumber,
      },
    });

    // Create database user
    await this.createDatabaseUser({
      clerkUserId: invitation.id,
      email: hrUser.email,
      name: `${hrUser.firstName} ${hrUser.lastName}`,
      role: this.mapHRRoleToSystemRole(hrUser.role),
      managerId: await this.findManagerId(hrUser.managerId),
    });
  }
}
```

---

## Theming & Styling

### Custom Theme System

#### 1. Theme Configuration

```typescript
// lib/theme/custom-theme.ts
export interface CustomTheme extends BaseTheme {
  brand: {
    primary: string;
    secondary: string;
    accent: string;
    logo: string;
  };
  layout: {
    sidebarWidth: string;
    headerHeight: string;
    contentPadding: string;
  };
  components: {
    card: ComponentTheme;
    button: ComponentTheme;
    form: ComponentTheme;
  };
}

export const createCustomTheme = (
  overrides: Partial<CustomTheme>
): CustomTheme => {
  return {
    ...defaultTheme,
    ...overrides,
    brand: {
      ...defaultTheme.brand,
      ...overrides.brand,
    },
    components: {
      ...defaultTheme.components,
      ...overrides.components,
    },
  };
};

// Example custom theme
export const corporateTheme = createCustomTheme({
  brand: {
    primary: "#1e40af", // Blue
    secondary: "#64748b", // Slate
    accent: "#059669", // Emerald
    logo: "/logos/corporate-logo.svg",
  },
  components: {
    card: {
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      shadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    button: {
      primary: {
        background: "#1e40af",
        color: "white",
        borderRadius: "6px",
      },
      secondary: {
        background: "#f8fafc",
        color: "#475569",
        borderRadius: "6px",
      },
    },
  },
});
```

#### 2. Dynamic Theme Provider

```typescript
// components/theme/theme-provider.tsx
interface ThemeContextType {
  theme: CustomTheme;
  setTheme: (theme: CustomTheme) => void;
  applyTheme: (themeName: string) => void;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(defaultTheme);

  const applyTheme = useCallback((themeName: string) => {
    const theme = getThemeByName(themeName);
    if (theme) {
      setCurrentTheme(theme);
      applyThemeToDOM(theme);
      localStorage.setItem('selectedTheme', themeName);
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{
      theme: currentTheme,
      setTheme: setCurrentTheme,
      applyTheme,
    }}>
      <div
        className="theme-root"
        style={{
          '--primary-color': currentTheme.brand.primary,
          '--secondary-color': currentTheme.brand.secondary,
          '--accent-color': currentTheme.brand.accent,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
```

#### 3. Custom CSS Variables

```css
/* styles/themes/custom-theme.css */
:root {
  /* Brand colors */
  --brand-primary: #1e40af;
  --brand-secondary: #64748b;
  --brand-accent: #059669;

  /* Layout */
  --sidebar-width: 280px;
  --header-height: 64px;
  --content-padding: 24px;

  /* Component styling */
  --card-background: white;
  --card-border: 1px solid #e5e7eb;
  --card-border-radius: 8px;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  /* Typography */
  --font-family-primary: "Inter", sans-serif;
  --font-family-mono: "Roboto Mono", monospace;
}

/* Dark theme overrides */
[data-theme="dark"] {
  --brand-primary: #3b82f6;
  --brand-secondary: #94a3b8;
  --card-background: #1f2937;
  --card-border: 1px solid #374151;
}

/* Custom component styles */
.custom-card {
  background: var(--card-background);
  border: var(--card-border);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
}

.custom-button-primary {
  background: var(--brand-primary);
  color: white;
  border-radius: 6px;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.custom-button-primary:hover {
  background: color-mix(in srgb, var(--brand-primary) 80%, black);
}
```

---

## Plugin Architecture

### Plugin System Implementation

#### 1. Plugin Interface

```typescript
// lib/plugins/plugin-system.ts
export interface Plugin {
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies?: string[];

  // Lifecycle hooks
  onInstall?(): Promise<void>;
  onUninstall?(): Promise<void>;
  onActivate?(): Promise<void>;
  onDeactivate?(): Promise<void>;

  // Extension points
  extendRoutes?(): RouteExtension[];
  extendComponents?(): ComponentExtension[];
  extendSchema?(): SchemaExtension[];
  extendPermissions?(): PermissionExtension[];
}

export class PluginManager {
  private plugins = new Map<string, Plugin>();
  private activePlugins = new Set<string>();

  async installPlugin(plugin: Plugin): Promise<void> {
    // Validate dependencies
    await this.validateDependencies(plugin);

    // Install plugin
    this.plugins.set(plugin.name, plugin);

    // Run installation hook
    if (plugin.onInstall) {
      await plugin.onInstall();
    }

    // Apply extensions
    await this.applyPluginExtensions(plugin);
  }

  async activatePlugin(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }

    this.activePlugins.add(pluginName);

    if (plugin.onActivate) {
      await plugin.onActivate();
    }
  }

  private async applyPluginExtensions(plugin: Plugin): Promise<void> {
    // Apply route extensions
    if (plugin.extendRoutes) {
      const routes = plugin.extendRoutes();
      routes.forEach(route => this.registerRoute(route));
    }

    // Apply component extensions
    if (plugin.extendComponents) {
      const components = plugin.extendComponents();
      components.forEach(comp => this.registerComponent(comp));
    }

    // Apply schema extensions
    if (plugin.extendSchema) {
      const schemas = plugin.extendSchema();
      await this.extendGraphQLSchema(schemas);
    }
  }
}
```

#### 2. Example Plugin Implementation

```typescript
// plugins/custom-reporting-plugin.ts
export const CustomReportingPlugin: Plugin = {
  name: "custom-reporting",
  version: "1.0.0",
  description: "Advanced reporting and analytics",
  author: "Custom Development Team",

  async onInstall() {
    // Create custom database tables
    await this.createReportingTables();

    // Set up background jobs
    await this.scheduleReportingJobs();
  },

  extendRoutes() {
    return [
      {
        path: "/custom-reports",
        component: () => import("./components/custom-reports-page"),
        permissions: ["custom_reports:read"],
      },
      {
        path: "/api/custom-reports",
        handler: customReportsHandler,
        methods: ["GET", "POST"],
      },
    ];
  },

  extendComponents() {
    return [
      {
        name: "CustomReportWidget",
        component: CustomReportWidget,
        placement: "dashboard-widgets",
        priority: 100,
      },
    ];
  },

  extendSchema() {
    return [
      {
        typeDefs: customReportingSchema,
        resolvers: customReportingResolvers,
      },
    ];
  },

  extendPermissions() {
    return [
      {
        resource: "custom_reports",
        actions: ["read", "create", "export", "schedule"],
        roles: ["admin", "manager"],
      },
    ];
  },
};
```

---

## Configuration Management

### Environment-Based Configuration

#### 1. Configuration Schema

```typescript
// lib/config/configuration.ts
export interface ApplicationConfig {
  app: {
    name: string;
    version: string;
    environment: "development" | "staging" | "production";
    debug: boolean;
  };

  database: {
    url: string;
    poolSize: number;
    timeout: number;
  };

  auth: {
    clerkPublishableKey: string;
    clerkSecretKey: string;
    jwtSecret: string;
    sessionTimeout: number;
  };

  graphql: {
    endpoint: string;
    adminSecret: string;
    introspection: boolean;
    playground: boolean;
  };

  features: {
    aiAssistant: boolean;
    customReporting: boolean;
    advancedAudit: boolean;
    multiTenant: boolean;
  };

  integrations: {
    openai: {
      apiKey: string;
      model: string;
    };

    payrollSystems: {
      [key: string]: {
        enabled: boolean;
        config: Record<string, any>;
      };
    };
  };

  customization: {
    theme: string;
    branding: {
      logo: string;
      primaryColor: string;
      companyName: string;
    };

    modules: {
      [moduleName: string]: {
        enabled: boolean;
        config: Record<string, any>;
      };
    };
  };
}
```

#### 2. Configuration Provider

```typescript
// lib/config/config-provider.ts
export class ConfigurationProvider {
  private config: ApplicationConfig;

  constructor() {
    this.config = this.loadConfiguration();
  }

  private loadConfiguration(): ApplicationConfig {
    const baseConfig = this.getBaseConfiguration();
    const envOverrides = this.getEnvironmentOverrides();
    const userOverrides = this.getUserConfiguration();

    return deepMerge(baseConfig, envOverrides, userOverrides);
  }

  get<T = any>(path: string): T {
    return this.getValueByPath(this.config, path);
  }

  async updateConfiguration(path: string, value: any): Promise<void> {
    this.setValueByPath(this.config, path, value);
    await this.persistConfiguration();
    this.notifyConfigurationChange(path, value);
  }

  isFeatureEnabled(featureName: string): boolean {
    return this.get(`features.${featureName}`) === true;
  }

  getModuleConfig(moduleName: string): Record<string, any> {
    return this.get(`customization.modules.${moduleName}.config`) || {};
  }
}

// Global configuration instance
export const config = new ConfigurationProvider();
```

#### 3. Feature Flags

```typescript
// lib/config/feature-flags.ts
export class FeatureFlagManager {
  private flags = new Map<string, FeatureFlag>();

  defineFlag(name: string, flag: FeatureFlag): void {
    this.flags.set(name, flag);
  }

  async isEnabled(
    flagName: string,
    context?: FeatureFlagContext
  ): Promise<boolean> {
    const flag = this.flags.get(flagName);
    if (!flag) return false;

    // Check environment-based enablement
    if (
      flag.environments &&
      !flag.environments.includes(config.get("app.environment"))
    ) {
      return false;
    }

    // Check role-based enablement
    if (
      flag.roles &&
      context?.userRole &&
      !flag.roles.includes(context.userRole)
    ) {
      return false;
    }

    // Check percentage rollout
    if (flag.percentage !== undefined) {
      const hash = this.hashUser(context?.userId || "anonymous");
      return hash < flag.percentage;
    }

    return flag.enabled;
  }
}

// Feature flag definitions
export const FeatureFlags = {
  ADVANCED_REPORTING: {
    enabled: true,
    environments: ["staging", "production"],
    roles: ["admin", "manager"],
    description: "Advanced reporting and analytics features",
  },

  AI_ASSISTANT: {
    enabled: true,
    percentage: 50, // 50% rollout
    description: "AI-powered assistant features",
  },

  MULTI_TENANT: {
    enabled: false,
    environments: ["development"],
    description: "Multi-tenant architecture support",
  },
};
```

This comprehensive customization and extension guide provides detailed instructions for extending every aspect of the Payroll Matrix system, from domain-driven customization to plugin architecture, ensuring developers can adapt the system to meet specific business requirements while maintaining code quality and system integrity.
