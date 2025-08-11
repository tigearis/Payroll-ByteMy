import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@/components/data";

// Common column factory functions for consistent table columns
export const ColumnFactories = {
  createStatusColumn: createStatusColumn,
  createDateColumn: createDateColumn,
  createTextColumn: createTextColumn,
  createNumberColumn: createNumberColumn,
  
  // Shorthand methods
  status: createStatusColumn,
  date: createDateColumn,
  text: createTextColumn,
  number: createNumberColumn,
};

export const CommonColumnSets = {
  // Add common column sets here if needed
  basic: ["id", "name", "status", "createdAt"] as const,
  detailed: ["id", "name", "description", "status", "createdAt", "updatedAt"] as const,
  
  billingItemColumns: function<T>(): ColumnDef<T>[] {
    return [
      ColumnFactories.createTextColumn<T>("client", "Client"),
      ColumnFactories.createTextColumn<T>("serviceName", "Service"),
      ColumnFactories.createNumberColumn<T>("amount", "Amount", (val) => 
        new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(val)
      ),
      ColumnFactories.createStatusColumn<T>("status"),
    ];
  }
};
export function createStatusColumn<T>(
  accessor: string,
  statusMap?: Record<string, { variant: string; label: string }>
): ColumnDef<T> {
  return {
    id: accessor,
    key: accessor,
    label: "Status",
    essential: true,
    sortable: true,
    render: (value: any) => {
      const config = statusMap?.[value] || { variant: "outline", label: String(value) };
      return (
        <Badge variant={config.variant as any}>
          {config.label}
        </Badge>
      );
    },
  };
}

export function createDateColumn<T>(
  accessor: string,
  label: string = "Date"
): ColumnDef<T> {
  return {
    id: accessor,
    key: accessor,
    label,
    essential: true,
    sortable: true,
    render: (value: any) => {
      if (!value) return "-";
      return new Date(value).toLocaleDateString();
    },
  };
}

export function createTextColumn<T>(
  accessor: string,
  label: string,
  options: {
    essential?: boolean;
    sortable?: boolean;
    truncate?: boolean;
    maxLength?: number;
  } = {}
): ColumnDef<T> {
  const { essential = true, sortable = true, truncate = false, maxLength = 50 } = options;
  
  return {
    id: accessor,
    key: accessor,
    label,
    essential,
    sortable,
    render: (value: any) => {
      if (!value) return "-";
      const text = String(value);
      if (truncate && text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      }
      return text;
    },
  };
}

export function createNumberColumn<T>(
  accessor: string,
  label: string,
  formatter?: (value: number) => string
): ColumnDef<T> {
  return {
    id: accessor,
    key: accessor,
    label,
    essential: true,
    sortable: true,
    render: (value: any) => {
      if (value == null) return "-";
      const num = Number(value);
      return formatter ? formatter(num) : num.toString();
    },
  };
}