// app/(dashboard)/staff/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample staff data
const staffMembers = [
  {
    id: "STF-001",
    name: "Alice Johnson",
    role: "Payroll Consultant",
    email: "alice@payrollmatrix.com",
    phone: "(555) 123-4567",
    assignedPayrolls: 8,
    status: "Active",
  },
  {
    id: "STF-002",
    name: "Bob Smith",
    role: "Payroll Manager",
    email: "bob@payrollmatrix.com",
    phone: "(555) 234-5678",
    assignedPayrolls: 12,
    status: "Active",
  },
  {
    id: "STF-003",
    name: "Carol Williams",
    role: "Payroll Specialist",
    email: "carol@payrollmatrix.com",
    phone: "(555) 345-6789",
    assignedPayrolls: 6,
    status: "Active",
  },
  {
    id: "STF-004",
    name: "David Brown",
    role: "Payroll Consultant",
    email: "david@payrollmatrix.com",
    phone: "(555) 456-7890",
    assignedPayrolls: 7,
    status: "On Leave",
  },
]

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
          <p className="text-muted-foreground">Manage your payroll consultants and staff members.</p>
        </div>
        <Button asChild>
          <Link href="/staff/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Staff
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff List</CardTitle>
          <CardDescription>View and manage all your staff members in one place.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Assigned Payrolls</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.id}</TableCell>
                  <TableCell>
                    <Link href={`/staff/${staff.id}`} className="text-primary hover:underline">
                      {staff.name}
                    </Link>
                  </TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.phone}</TableCell>
                  <TableCell>{staff.assignedPayrolls}</TableCell>
                  <TableCell>
                    <Badge variant={staff.status === "Active" ? "default" : "secondary"}>{staff.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStaff.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No staff members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}