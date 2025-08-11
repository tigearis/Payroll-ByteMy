import {
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Hash,
  Eye,
  Edit,
  Trash2,
  Calculator,
  Building2,
  MapPin,
  FileText,
} from "lucide-react";
import React from "react";
import type { ColumnDef, RowAction } from "@/components/data/modern-data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  SuccessStatus,
  ErrorStatus,
  WarningStatus,
  InfoStatus,
} from "@/components/ui/status-indicator";
import { safeFormatDate } from "@/lib/utils/date-utils";

// Common status mapping
const getStatusComponent = (
  status: string | boolean,
  variant: "success" | "error" | "warning" | "info" = "success"
) => {
  const statusText =
    typeof status === "boolean" ? (status ? "Active" : "Inactive") : status;

  switch (variant) {
    case "success":
      return <SuccessStatus size="sm">{statusText}</SuccessStatus>;
    case "error":
      return <ErrorStatus size="sm">{statusText}</ErrorStatus>;
    case "warning":
      return <WarningStatus size="sm">{statusText}</WarningStatus>;
    case "info":
      return <InfoStatus size="sm">{statusText}</InfoStatus>;
    default:
      return <Badge variant="outline">{statusText}</Badge>;
  }
};

// Format currency helper
const formatCurrency = (amount: number, currency = "AUD") => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Column Factory Functions
 * Reusable column definitions with common patterns
 */
export const ColumnFactories = {
  // Name column with optional icon and link
  name: <T extends { name: string; id?: string }>(
    key: keyof T = "name" as keyof T,
    label = "Name",
    icon?: React.ComponentType<{ className?: string }>,
    linkPath?: (item: T) => string
  ): ColumnDef<T> => ({
    id: "name",
    key: key as keyof T,
    label,
    essential: true,
    sortable: true,
    render: (_, item) => {
      const IconComponent = icon;
      const content = (
        <div className="flex items-center gap-2 min-w-0">
          {IconComponent && (
            <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
          <span className="font-medium truncate">{item.name}</span>
        </div>
      );

      if (linkPath) {
        return (
          <a
            href={linkPath(item)}
            className="text-primary hover:text-primary/90 block"
          >
            {content}
          </a>
        );
      }

      return content;
    },
  }),

  // User column with avatar and name
  user: <
    T extends {
      firstName?: string;
      lastName?: string;
      computedName?: string;
      email?: string;
      image?: string;
    },
  >(
    key: keyof T = "computedName" as keyof T,
    label = "User"
  ): ColumnDef<T> => ({
    id: "user",
    key: key as keyof T,
    label,
    essential: true,
    sortable: true,
    render: (_, item) => (
      <div className="flex items-center gap-2 min-w-0">
        <Avatar className="h-6 w-6">
          <AvatarImage src={item.image || undefined} />
          <AvatarFallback className="text-xs">
            {item.firstName?.[0]}
            {item.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="font-medium truncate">
            {item.computedName ||
              `${item.firstName || ""} ${item.lastName || ""}`.trim()}
          </div>
          {item.email && (
            <div className="text-xs text-muted-foreground truncate">
              {item.email}
            </div>
          )}
        </div>
      </div>
    ),
  }),

  // Email column
  email: <T extends Record<string, any>>(
    key: keyof T,
    label = "Email"
  ): ColumnDef<T> => ({
    id: "email",
    key: key as keyof T,
    label,
    essential: false,
    sortable: true,
    render: value =>
      value ? (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a
            href={`mailto:${value}`}
            className="text-primary hover:text-primary/90"
          >
            {value}
          </a>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  }),

  // Phone column
  phone: <T extends Record<string, any>>(
    key: keyof T,
    label = "Phone"
  ): ColumnDef<T> => ({
    id: "phone",
    key: key as keyof T,
    label,
    essential: false,
    sortable: true,
    render: value =>
      value ? (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a
            href={`tel:${value}`}
            className="text-primary hover:text-primary/90"
          >
            {value}
          </a>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  }),

  // Currency/Amount column
  currency: <T extends Record<string, any>>(
    key: keyof T,
    label = "Amount",
    currency = "AUD"
  ): ColumnDef<T> => ({
    id: "currency",
    key: key as keyof T,
    label,
    essential: true,
    sortable: true,
    render: value => (
      <div className="flex items-center gap-2 font-mono">
        <DollarSign className="h-4 w-4 text-muted-foreground" />
        <span className="font-semibold">
          {formatCurrency(value || 0, currency)}
        </span>
      </div>
    ),
  }),

  // Date column
  date: <T extends Record<string, any>>(
    key: keyof T,
    label = "Date",
    formatString = "dd MMM yyyy"
  ): ColumnDef<T> => ({
    id: "date",
    key: key as keyof T,
    label,
    essential: false,
    sortable: true,
    render: value =>
      value ? (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{safeFormatDate(value, formatString)}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  }),

  // Status column with customizable variants
  status: <T extends Record<string, any>>(
    key: keyof T,
    label = "Status",
    variant: "success" | "error" | "warning" | "info" = "success"
  ): ColumnDef<T> => ({
    id: "status",
    key: key as keyof T,
    label,
    essential: true,
    sortable: true,
    render: value => getStatusComponent(value, variant),
  }),

  // Count/Number column
  count: <T extends Record<string, any>>(
    key: keyof T,
    label = "Count",
    icon?: React.ComponentType<{ className?: string }>
  ): ColumnDef<T> => ({
    id: "count",
    key: key as keyof T,
    label,
    essential: true,
    sortable: true,
    render: value => {
      const IconComponent = icon || Hash;
      return (
        <div className="flex items-center gap-2">
          <IconComponent className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono font-semibold">{value || 0}</span>
        </div>
      );
    },
  }),

  // Address column
  address: <T extends Record<string, any>>(
    key: keyof T,
    maxLength = 30
  ): ColumnDef<T> => ({
    id: "address",
    key: key as keyof T,
    label: "Address",
    essential: false,
    sortable: true,
    render: value =>
      value ? (
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate" title={value}>
            {value.length > maxLength
              ? `${value.substring(0, maxLength)}...`
              : value}
          </span>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  }),

  // Notes column
  notes: <T extends Record<string, any>>(
    key: keyof T,
    maxLength = 50
  ): ColumnDef<T> => ({
    id: "notes",
    key: key as keyof T,
    label: "Notes",
    essential: false,
    sortable: false,
    render: value =>
      value ? (
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate text-sm" title={value}>
            {value.length > maxLength
              ? `${value.substring(0, maxLength)}...`
              : value}
          </span>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  }),
};

/**
 * Common Column Sets
 * Pre-built column combinations for common entities
 */
export const CommonColumnSets = {
  // User columns (4 essential columns)
  userColumns: <
    T extends {
      firstName?: string;
      lastName?: string;
      computedName?: string;
      email?: string;
      role?: string;
      isActive?: boolean;
    },
  >(): ColumnDef<T>[] => [
    ColumnFactories.user<T>("computedName", "Name"),
    ColumnFactories.email<T>("email" as keyof T),
    {
      id: "role",
      key: "role",
      label: "Role",
      essential: true,
      sortable: true,
      render: value => (
        <Badge variant="outline" className="capitalize">
          {value?.replace("_", " ") || "N/A"}
        </Badge>
      ),
    },
    ColumnFactories.status<T>("isActive" as keyof T, "Status"),
  ],

  // Client columns (4 essential columns)
  clientColumns: <
    T extends {
      name: string;
      id?: string;
      contactPerson?: string;
      active?: boolean;
      payrollsAggregate?: { aggregate?: { count?: number } };
    },
  >(): ColumnDef<T>[] => [
    ColumnFactories.name<T>(
      "name" as keyof T,
      "Client",
      Building2,
      item => `/clients/${item.id}`
    ),
    {
      id: "contact",
      key: "contactPerson",
      label: "Contact",
      essential: true,
      sortable: true,
      render: (_, item) => (
        <div className="flex items-center gap-2 min-w-0">
          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate">
            {item.contactPerson || "No contact person"}
          </span>
        </div>
      ),
    },
    ColumnFactories.count<T>(
      "payrollsAggregate" as keyof T,
      "Payrolls",
      Calculator
    ),
    ColumnFactories.status<T>("active" as keyof T),
  ],

  // Billing item columns (4 essential columns)
  billingItemColumns: <
    T extends {
      clientName?: string;
      serviceName?: string;
      amount?: number;
      isApproved?: boolean;
    },
  >(): ColumnDef<T>[] => [
    {
      id: "client",
      key: "clientName",
      label: "Client",
      essential: true,
      sortable: true,
    },
    {
      id: "service",
      key: "serviceName",
      label: "Service",
      essential: true,
    },
    ColumnFactories.currency<T>("amount" as keyof T),
    {
      id: "status",
      key: "isApproved",
      label: "Status",
      essential: true,
      render: value => (value ? "Approved" : "Draft"),
    },
  ],

  // Payroll columns (4 essential columns)
  payrollColumns: <
    T extends {
      name: string;
      id?: string;
      client?: { name: string };
      employeeCount?: number;
      status?: string;
    },
  >(): ColumnDef<T>[] => [
    ColumnFactories.name<T>(
      "name" as keyof T,
      "Payroll",
      Calculator,
      item => `/payrolls/${item.id}`
    ),
    {
      id: "client",
      key: "client",
      label: "Client",
      essential: true,
      sortable: true,
      render: (_, item) => item.client?.name || "—",
    },
    ColumnFactories.count<T>("employeeCount" as keyof T, "Employees", User),
    ColumnFactories.status<T>("status" as keyof T),
  ],
};

/**
 * CRUD Action Generators
 * Generate standard row actions for common operations
 */
export const generateCrudActions = <T extends { id?: string }>(
  entityName: string,
  basePath: string,
  options: {
    canEdit?: (item: T) => boolean;
    canDelete?: (item: T) => boolean;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    customActions?: RowAction<T>[];
  } = {}
): RowAction<T>[] => {
  const {
    canEdit = () => true,
    canDelete = () => true,
    onEdit,
    onDelete,
    customActions = [],
  } = options;

  const actions: RowAction<T>[] = [
    {
      id: "view",
      label: `View ${entityName}`,
      icon: Eye,
      onClick: item => {
        window.open(`${basePath}/${item.id}`, "_blank");
      },
    },
    {
      id: "edit",
      label: `Edit ${entityName}`,
      icon: Edit,
      onClick:
        onEdit ||
        (item => {
          window.open(`${basePath}/${item.id}/edit`, "_blank");
        }),
      disabled: item => !canEdit(item),
    },
    {
      id: "delete",
      label: `Delete ${entityName}`,
      icon: Trash2,
      variant: "destructive",
      onClick:
        onDelete ||
        (item => {
          if (
            confirm(
              `Are you sure you want to delete this ${entityName.toLowerCase()}?`
            )
          ) {
            // Handle delete action
            console.log(`Delete ${entityName}:`, item.id);
          }
        }),
      disabled: item => !canDelete(item),
    },
    ...customActions,
  ];

  return actions;
};
