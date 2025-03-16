"use client";

import * as React from "react";
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
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_PAYROLL_DATES } from "@/graphql/queries/payrolls/getPayrollDates";
import { format, parseISO, isEqual } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { NotesModal } from "./notes-modal";

interface PayrollDate {
  id: string;
  original_eft_date: string;
  adjusted_eft_date: string;
  processing_date: string;
  notes?: string;
}

interface PayrollDatesViewProps {
  payrollId: string;
}

export function PayrollDatesView({ payrollId }: PayrollDatesViewProps) {
  // Always call hooks at the top level
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showNoteDialog, setShowNoteDialog] = React.useState(false);
  const [selectedNote, setSelectedNote] = React.useState<string | null>(null);

  // UseQuery hook
  const { loading, error, data, refetch } = useQuery(GET_PAYROLL_DATES, {
    variables: { id: payrollId },
    skip: !payrollId,
  });

  // Define columns outside of any conditional rendering
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
        if (!row.original.original_eft_date) return null;
        return format(parseISO(row.original.original_eft_date), "MMM d, yyyy");
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
        if (!row.original.original_eft_date || !row.original.adjusted_eft_date) return null;
        
        const originalDate = parseISO(row.original.original_eft_date);
        const adjustedDate = parseISO(row.original.adjusted_eft_date);
        const isAdjusted = !isEqual(originalDate, adjustedDate);

        return (
          <div>
            {format(adjustedDate, "MMM d, yyyy")} {isAdjusted && <span className="text-amber-600 ml-1">(Adjusted)</span>}
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
        if (!row.original.processing_date) return null;
        return format(parseISO(row.original.processing_date), "MMM d, yyyy");
      },
    },
// In the PayrollDatesView component, update the "View Note" cell rendering:

// In the columns definition
{
  accessorKey: "notes",
  header: "Notes",
  cell: ({ row }) => (
    <div>
      {row.original.notes ? (
        <NotesModal 
          note={{
            id: row.original.id,
            content: row.original.notes
          }}
          refetchNotes={() => refetch()} // Add a refetch function
        />
      ) : (
        <span className="text-gray-500">-</span>
      )}
    </div>
  ),
}
  ];

  // Prepare data for the table - use an empty array if data isn't loaded yet
  const dates: PayrollDate[] = data?.payroll_dates || [];

  // Use React Table hook regardless of loading state
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

  // Render loading or error state AFTER all hooks have been called
  if (loading) return <div className="flex justify-center py-8">Loading payroll dates...</div>;
  if (error) return <div className="text-red-500 py-4">Error: {error.message}</div>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-end py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : 
                      flexRender(header.column.columnDef.header, header.getContext())
                    }
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No payroll dates found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
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
      
      {/* Dialog for viewing notes */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Note</DialogTitle>
          </DialogHeader>
          <div className="py-4">{selectedNote}</div>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}