import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { staff } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getStaffMember(id: string) {
  const staffMember = await db.query.staff.findFirst({
    where: eq(staff.id, Number.parseInt(id)),
    with: {
      primaryPayrolls: true,
      backupPayrolls: true,
      managedPayrolls: true,
    },
  })

  if (!staffMember) notFound()
  return staffMember
}

export default async function StaffPage({ params }: { params: { id: string } }) {
  const staffMember = await getStaffMember(params.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Staff Details</h2>
        <p className="text-muted-foreground">Viewing details for staff ID: {staffMember.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{staffMember.name}</CardTitle>
          <CardDescription>Position: {staffMember.position}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant={staffMember.active ? "default" : "secondary"}>
                {staffMember.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{staffMember.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{staffMember.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Created At:</span>
              <span>{staffMember.created_at.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span>{staffMember.updated_at.toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Payrolls</CardTitle>
          <CardDescription>Payrolls this staff member is involved with</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Primary Consultant For:</h4>
              {staffMember.primaryPayrolls.length > 0 ? (
                <ul className="list-disc pl-5">
                  {staffMember.primaryPayrolls.map((payroll) => (
                    <li key={payroll.id}>{payroll.name}</li>
                  ))}
                </ul>
              ) : (
                <p>Not a primary consultant for any payrolls.</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold">Backup Consultant For:</h4>
              {staffMember.backupPayrolls.length > 0 ? (
                <ul className="list-disc pl-5">
                  {staffMember.backupPayrolls.map((payroll) => (
                    <li key={payroll.id}>{payroll.name}</li>
                  ))}
                </ul>
              ) : (
                <p>Not a backup consultant for any payrolls.</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold">Manager For:</h4>
              {staffMember.managedPayrolls.length > 0 ? (
                <ul className="list-disc pl-5">
                  {staffMember.managedPayrolls.map((payroll) => (
                    <li key={payroll.id}>{payroll.name}</li>
                  ))}
                </ul>
              ) : (
                <p>Not a manager for any payrolls.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

