"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { parseISO, isEqual, startOfDay } from "date-fns";
import {
  ArrowUpDown,
  ChevronDown,
  Calendar,
  History,
  RefreshCw,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicPayrollCompletionForm } from "@/domains/billing/components/payroll-completion/dynamic-payroll-completion-form";
import {
  GetPayrollFamilyDatesDocument,
  GetPayrollDatesDocument,
} from "@/domains/payrolls/graphql/generated/graphql";
import { useDatabaseUserId } from "@/hooks/use-database-user-id";
import { safeFormatDate } from "@/lib/utils/date-utils";
import { NotesListModal } from "./notes-list-modal";
// Fragment masking disabled - no longer needed

interface PayrollDate {
  id: string;
  original_eft_date: string;
  adjusted_eft_date: string;
  processing_date: string;
  notes?: string;
  status?: string;
  completed_at?: string;
  completed_by?: string;
  payroll_id: string;
  payroll?: {
    id: string;
    name: string;
    version_number: number;
    parent_payroll_id?: string;
    go_live_date?: string;
    superseded_date?: string;
    status: string;
  };
}

interface PayrollDatesViewProps {
  payrollId: string;
  showAllVersions: boolean;
}

// (removed unused helper)

// PayrollDatesTable component for reusability
function PayrollDatesTable({
  dates,
  title,
  emptyMessage,
  refetch,
  openAdvancedCompletion,
}: {
  dates: PayrollDate[];
  title: string;
  emptyMessage: string;
  refetch: () => void;
  openAdvancedCompletion: (payrollDateId: string) => void;
}) {
  const { user } = useUser();
  const { databaseUserId, isReady } = useDatabaseUserId();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<PayrollDate>[] = [
    {
      accessorKey: "original_eft_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 font-medium"
          >
            Original EFT Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        if (!row.original.original_eft_date) {
          return null;
        }
        return safeFormatDate(row.original.original_eft_date, "dd MMM yyyy");
      },
    },
    {
      accessorKey: "adjusted_eft_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 font-medium"
          >
            Adjusted EFT Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        if (
          !row.original.original_eft_date ||
          !row.original.adjusted_eft_date
        ) {
          return null;
        }

        const originalDate = parseISO(row.original.original_eft_date);
        const adjustedDate = parseISO(row.original.adjusted_eft_date);
        const isAdjusted = !isEqual(originalDate, adjustedDate);
        const today = startOfDay(new Date());
        const dateToCheck = startOfDay(adjustedDate);

        // Determine badge color based on date status
        let badgeClass = "";
        let badgeText = "";

        if (dateToCheck.getTime() === today.getTime()) {
          badgeClass = "bg-blue-100 text-blue-800";
          badgeText = "Today";
        } else if (dateToCheck > today) {
          badgeClass = "bg-green-100 text-green-800";
          badgeText = "Upcoming";
        } else {
          badgeClass = "bg-gray-100 text-gray-800";
          badgeText = "Past";
        }

        return (
          <div className="flex items-center gap-2">
            <span>
              {safeFormatDate(row.original.adjusted_eft_date, "dd MMM yyyy")}
            </span>
            {isAdjusted && (
              <span className="text-amber-600 text-sm">(Adjusted)</span>
            )}
            <Badge
              variant="secondary"
              className={`${badgeClass} text-xs px-2 py-1`}
            >
              {badgeText}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "processing_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 font-medium"
          >
            Processing Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        if (!row.original.processing_date) {
          return null;
        }
        return safeFormatDate(row.original.processing_date, "dd MMM yyyy");
      },
    },
    {
      accessorKey: "payroll.version_number",
      header: "Version",
      cell: ({ row }) => {
        if (!row.original.payroll?.version_number) {
          return <span className="text-gray-500">-</span>;
        }

        const version = row.original.payroll.version_number;
        const isSuperseded = row.original.payroll.superseded_date;

        return (
          <div className="flex items-center gap-2">
            <Badge
              variant={isSuperseded ? "outline" : "default"}
              className={isSuperseded ? "text-gray-500" : ""}
            >
              v{version}
            </Badge>
            {isSuperseded && (
              <span className="text-xs text-gray-400">(superseded)</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "pending";
        const isCompleted = status === "completed";

        return (
          <div className="flex items-center gap-2">
            <Badge
              variant={isCompleted ? "default" : "secondary"}
              className={
                isCompleted
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </>
              )}
            </Badge>
            {!isCompleted && (
              <PermissionGuard action="manage">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAdvancedCompletion(row.original.id)}
                  className="h-6 px-2 text-xs"
                >
                  Complete
                </Button>
              </PermissionGuard>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <div>
          <NotesListModal
            payrollDateId={row.original.id}
            existingNotes={row.original.notes ?? null}
            {...(row.original.adjusted_eft_date && {
              payrollDate: row.original.adjusted_eft_date,
            })}
            refetchNotes={() => refetch()}
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: dates,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="outline" className="ml-2">
            {dates.length} {dates.length === 1 ? "date" : "dates"}
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id.replace("_", " ")}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {table.getRowModel().rows?.length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PayrollDatesView({
  payrollId,
  showAllVersions,
}: PayrollDatesViewProps) {
  const { user } = useUser();
  const { databaseUserId, isReady } = useDatabaseUserId();

  // Advanced completion form state
  const [showAdvancedCompletion, setShowAdvancedCompletion] = React.useState(false);
  const [selectedPayrollDateId, setSelectedPayrollDateId] = React.useState<
    string | null
  >(null);

  // Show all family versions or just current one
  const showFamilyDates = showAllVersions;

  const openAdvancedCompletion = (payrollDateId: string) => {
    setSelectedPayrollDateId(payrollDateId);
    setShowAdvancedCompletion(true);
  };

  const handleAdvancedCompletionComplete = (data: any) => {
    toast.success("Payroll completion process finished successfully");
    // Refetch the appropriate query
    if (showFamilyDates) {
      refetchSplit();
    } else {
      refetchSingle();
    }
    setShowAdvancedCompletion(false);
    setSelectedPayrollDateId(null);
  };

  const handleAdvancedCompletionCancel = () => {
    setShowAdvancedCompletion(false);
    setSelectedPayrollDateId(null);
  };

  // Get the family root ID for efficient querying
  const { data: _familyRootData } = useQuery(GetPayrollFamilyDatesDocument, {
    variables: { payrollId },
    skip: !showFamilyDates,
  });

  // For family dates, we use the original payrollId since the query already handles family logic
  const familyRootId = payrollId;
  // const today = format(new Date(), "yyyy-MM-dd");

  // Use the efficient split query when showing family dates
  const {
    data: splitData,
    loading: splitLoading,
    error: splitError,
    refetch: refetchSplit,
  } = useQuery(GetPayrollDatesDocument, {
    variables: {
      payrollId: familyRootId,
    },
    skip: !showFamilyDates,
  });

  // Use the original query for single payroll dates
  const {
    data: singleData,
    loading: singleLoading,
    error: singleError,
    refetch: refetchSingle,
  } = useQuery(GetPayrollDatesDocument, {
    variables: { payrollId },
    skip: showFamilyDates,
  });

  // Use the family query as fallback if split query is not working
  const {
    data: familyData,
    loading: _familyLoading,
    error: _familyError,
    refetch: _refetchFamily,
  } = useQuery(GetPayrollFamilyDatesDocument, {
    variables: { payrollId },
    skip: !showFamilyDates,
  });

  // Determine which data to use
  const loading = showFamilyDates ? splitLoading : singleLoading;
  const error = showFamilyDates ? splitError : singleError;
  const refetch = showFamilyDates ? refetchSplit : refetchSingle;

  // Process the data based on which query we're using
  let allDates: PayrollDate[] = [];
  let pastDates: PayrollDate[] = [];
  let futureDates: PayrollDate[] = [];

  if (showFamilyDates && splitData) {
    // Convert split data and do client-side filtering
    const splitDates = splitData.payrollDates || [];
    allDates = splitDates.map((date: any) => ({
      id: date.id,
      original_eft_date: date.originalEftDate,
      adjusted_eft_date: date.adjustedEftDate,
      processing_date: date.processingDate,
      notes: date.notes,
      payroll_id: date.payrollId,
      payroll: date.payroll
        ? {
            id: date.payroll.id,
            name: date.payroll.name,
            version_number: date.payroll.versionNumber,
            status: date.payroll.status,
            superseded_date: date.payroll.supersededDate,
          }
        : {
            id: "",
            name: "Unknown",
            version_number: 0,
            status: "Unknown",
            superseded_date: "",
          },
    }));
    const currentDate = startOfDay(new Date());
    pastDates = allDates.filter(date => {
      const adjustedDate = startOfDay(parseISO(date.adjusted_eft_date));
      return adjustedDate < currentDate;
    });
    futureDates = allDates.filter(date => {
      const adjustedDate = startOfDay(parseISO(date.adjusted_eft_date));
      return adjustedDate >= currentDate;
    });
  } else if (showFamilyDates && familyData) {
    // Fallback to client-side filtering - direct access since fragment masking is disabled
    const familyDates =
      familyData.payrolls.flatMap((payroll: any) =>
        payroll.payrollDates.map((date: any) => ({
          ...date,
          payroll: {
            id: payroll.id,
            name: payroll.name,
            version_number: payroll.versionNumber,
            status: payroll.status,
            superseded_date: payroll.supersededDate,
          },
        }))
      ) || [];
    // Convert to the expected format
    allDates = familyDates.map((date: any) => ({
      id: date.id,
      original_eft_date: date.originalEftDate,
      adjusted_eft_date: date.adjustedEftDate,
      processing_date: date.processingDate,
      notes: date.notes,
      payroll_id: date.payrollId,
      payroll: date.payroll,
    }));
    const currentDate = startOfDay(new Date());
    pastDates = allDates.filter(date => {
      const adjustedDate = startOfDay(parseISO(date.adjusted_eft_date));
      return adjustedDate < currentDate;
    });
    futureDates = allDates.filter(date => {
      const adjustedDate = startOfDay(parseISO(date.adjusted_eft_date));
      return adjustedDate >= currentDate;
    });
  } else if (singleData) {
    // Single payroll dates
    const singleDates = singleData.payrollDates || [];
    allDates = singleDates.map((date: any) => ({
      id: date.id,
      original_eft_date: date.originalEftDate,
      adjusted_eft_date: date.adjustedEftDate,
      processing_date: date.processingDate,
      notes: date.notes,
      payroll_id: date.payrollId,
      payroll: date.payroll
        ? {
            id: date.payroll.id,
            name: date.payroll.name,
            version_number: date.payroll.versionNumber,
            status: date.payroll.status,
            superseded_date: date.payroll.supersededDate,
          }
        : {
            id: "",
            name: "Unknown",
            version_number: 0,
            status: "Unknown",
            superseded_date: "",
          },
    }));
    const currentDate = startOfDay(new Date());
    pastDates = allDates.filter(date => {
      const adjustedDate = startOfDay(parseISO(date.adjusted_eft_date));
      return adjustedDate < currentDate;
    });
    futureDates = allDates.filter(date => {
      const adjustedDate = startOfDay(parseISO(date.adjusted_eft_date));
      return adjustedDate >= currentDate;
    });
  }

  const totalDates = allDates.length;
  const pastCount = pastDates.length;
  const futureCount = futureDates.length;

  // Use the already separated dates or fall back to categorization
  const displayFutureDates = futureDates.length > 0 ? futureDates : [];
  const displayPastDates = pastDates.length > 0 ? pastDates : [];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Payroll Dates</h2>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Payroll Dates</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Full Refresh
            </Button>
          </div>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Error loading payroll dates</span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            {error.message || "Failed to load payroll dates"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard action="read">
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Payroll Dates</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetch();
                toast.success("Refreshing payroll dates...");
              }}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.info("Refreshing entire page...");
                window.location.reload();
              }}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Full Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="future" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="future" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Future Dates
              <Badge variant="secondary" className="ml-1">
                {futureCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Past Dates
              <Badge variant="secondary" className="ml-1">
                {pastCount}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="future" className="space-y-4">
            <PayrollDatesTable
              dates={displayFutureDates}
              title="Upcoming Payroll Dates (All Versions)"
              emptyMessage="No upcoming payroll dates found in any version."
              refetch={refetch}
              openAdvancedCompletion={openAdvancedCompletion}
            />
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            <PayrollDatesTable
              dates={displayPastDates}
              title="Past Payroll Dates (All Versions)"
              emptyMessage="No past payroll dates found in any version."
              refetch={refetch}
              openAdvancedCompletion={openAdvancedCompletion}
            />
          </TabsContent>
        </Tabs>

        {/* Advanced Payroll Completion Form */}
        {showAdvancedCompletion && selectedPayrollDateId && (
          <Dialog open={showAdvancedCompletion} onOpenChange={setShowAdvancedCompletion}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>Complete Payroll Date - Advanced Billing</DialogTitle>
              </DialogHeader>
              <div className="max-h-[80vh] overflow-y-auto">
                <DynamicPayrollCompletionForm
                  payrollDateId={selectedPayrollDateId}
                  onComplete={handleAdvancedCompletionComplete}
                  onCancel={handleAdvancedCompletionCancel}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PermissionGuard>
  );
}
