"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery, gql } from "@apollo/client"
import { PlusCircle, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const GET_PAYROLLS = gql`
  query GetPayrolls {
    payrolls {
      id
      name
      client {
        name
      }
      cycle_id
      processing_days_before_eft
      active
    }
  }
`

export default function PayrollsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { loading, error, data } = useQuery(GET_PAYROLLS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const payrolls = data.payrolls

  const filteredPayrolls = payrolls.filter(
    (payroll: any) =>
      payroll.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payroll.client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payrolls</h2>
          <p className="text-muted-foreground">Manage all payrolls for your clients.</p>
        </div>
        <Button asChild>
          <Link href="/payrolls/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Payroll
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll List</CardTitle>
          <CardDescription>View and manage all payrolls in one place.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payrolls..."
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
                <TableHead>Client</TableHead>
                <TableHead>Cycle ID</TableHead>
                <TableHead>Processing Days</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayrolls.map((payroll: any) => (
                <TableRow key={payroll.id}>
                  <TableCell className="font-medium">{payroll.id}</TableCell>
                  <TableCell>
                    <Link href={`/payrolls/${payroll.id}`} className="text-primary hover:underline">
                      {payroll.name}
                    </Link>
                  </TableCell>
                  <TableCell>{payroll.client.name}</TableCell>
                  <TableCell>{payroll.cycle_id}</TableCell>
                  <TableCell>{payroll.processing_days_before_eft}</TableCell>
                  <TableCell>
                    <Badge variant={payroll.active ? "default" : "secondary"}>
                      {payroll.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPayrolls.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No payrolls found.
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

