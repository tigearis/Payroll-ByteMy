// components/clients-table.tsx
"use client";

import {
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  User,
  Mail,
  Phone,
  Calculator,
  CheckCircle,
  RefreshCw,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Column definitions
const COLUMN_DEFINITIONS = [
  { key: "name", label: "Client Name", sortable: true, defaultVisible: true },
  {
    key: "contactPerson",
    label: "Contact Person",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "contactEmail",
    label: "Contact Email",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "contactPhone",
    label: "Contact Phone",
    sortable: false,
    defaultVisible: true,
  },
  { key: "payrolls", label: "Payrolls", sortable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
];

interface Client {
  id: string;
  name: string;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  active: boolean;
  payrolls?: Array<{
    id: string;
    name: string;
    status: string;
    active?: boolean;
  }>;
}

interface ClientsTableProps {
  clients: Client[];
  loading?: boolean;
  onRefresh?: () => void;
  visibleColumns?: string[];
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
}

export function ClientsTable({
  clients,
  loading = false,
  onRefresh,
  visibleColumns = COLUMN_DEFINITIONS.filter((col) => col.defaultVisible).map(
    (col) => col.key
  ),
  sortField = "name",
  sortDirection = "asc",
  onSort,
}: ClientsTableProps) {
  const renderSortableHeader = (label: string, field: string) => {
    const column = COLUMN_DEFINITIONS.find((col) => col.key === field);
    if (!column?.sortable || !onSort) {return label;}

    const isSorted = sortField === field;

    return (
      <Button
        variant="ghost"
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => onSort(field)}
      >
        <span>{label}</span>
        {isSorted && (
          <div className="ml-1">
            {sortDirection === "asc" ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        )}
      </Button>
    );
  };

  // Helper function for consistent badge colors
  const getStatusColor = (active: boolean) => {
    return active
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Clients ({clients.length})</span>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.includes("name") && (
                  <TableHead>
                    {renderSortableHeader("Client Name", "name")}
                  </TableHead>
                )}
                {visibleColumns.includes("contactPerson") && (
                  <TableHead>
                    {renderSortableHeader("Contact Person", "contactPerson")}
                  </TableHead>
                )}
                {visibleColumns.includes("contactEmail") && (
                  <TableHead>
                    {renderSortableHeader("Contact Email", "contactEmail")}
                  </TableHead>
                )}
                {visibleColumns.includes("contactPhone") && (
                  <TableHead>
                    {renderSortableHeader("Contact Phone", "contactPhone")}
                  </TableHead>
                )}
                {visibleColumns.includes("payrolls") && (
                  <TableHead>
                    {renderSortableHeader("Payrolls", "payrolls")}
                  </TableHead>
                )}
                {visibleColumns.includes("status") && (
                  <TableHead>
                    {renderSortableHeader("Status", "status")}
                  </TableHead>
                )}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + 1}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-muted-foreground">
                        Loading clients...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : clients.length > 0 ? (
                clients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    {visibleColumns.includes("name") && (
                      <TableCell>
                        <Link
                          href={`/clients/${client.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {client.name}
                        </Link>
                      </TableCell>
                    )}
                    {visibleColumns.includes("contactPerson") && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>{client.contact_person || "Not set"}</span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("contactEmail") && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{client.contact_email || "Not set"}</span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("contactPhone") && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{client.contact_phone || "Not set"}</span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("payrolls") && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calculator className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">
                            {(client as any).payrolls?.length || 0}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("status") && (
                      <TableCell>
                        <Badge className={getStatusColor(client.active)}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {client.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/clients/${client.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Export Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + 1}
                    className="h-24 text-center"
                  >
                    <div className="text-muted-foreground">
                      No clients found with the current filters.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
