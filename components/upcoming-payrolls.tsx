// components/upcoming-payrolls.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const upcomingPayrolls = [
  { id: "PAY-001", client: "Acme Inc.", payrollName: "Main Office", date: "March 15, 2025", status: "Pending" },
  { id: "PAY-002", client: "TechCorp", payrollName: "Engineering", date: "March 18, 2025", status: "Processing" },
  { id: "PAY-003", client: "Global Foods", payrollName: "Retail Staff", date: "March 20, 2025", status: "Pending" },
  { id: "PAY-004", client: "Acme Inc.", payrollName: "Sales Team", date: "March 22, 2025", status: "Pending" },
]

export function UpcomingPayrolls() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Payroll Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {upcomingPayrolls.map((payroll) => (
          <TableRow key={payroll.id}>
            <TableCell className="font-medium">{payroll.id}</TableCell>
            <TableCell>{payroll.client}</TableCell>
            <TableCell>{payroll.payrollName}</TableCell>
            <TableCell>{payroll.date}</TableCell>
            <TableCell>{payroll.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}