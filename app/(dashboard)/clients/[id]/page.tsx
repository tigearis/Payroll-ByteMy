import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { clients } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getClient(id: string) {
  const client = await db.query.clients.findFirst({
    where: eq(clients.id, Number.parseInt(id)),
    with: {
      payrolls: true,
    },
  })

  if (!client) notFound()
  return client
}

export default async function ClientPage({ params }: { params: { id: string } }) {
  const client = await getClient(params.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Client Details</h2>
        <p className="text-muted-foreground">Viewing details for client ID: {client.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{client.name}</CardTitle>
          <CardDescription>Contact: {client.contact_person}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant={client.active ? "default" : "secondary"}>{client.active ? "Active" : "Inactive"}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{client.contact_email}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{client.contact_phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Created At:</span>
              <span>{client.created_at.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span>{client.updated_at.toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payrolls</CardTitle>
          <CardDescription>Payrolls associated with this client</CardDescription>
        </CardHeader>
        <CardContent>
          {client.payrolls.length > 0 ? (
            <ul className="list-disc pl-5">
              {client.payrolls.map((payroll) => (
                <li key={payroll.id}>
                  {payroll.name} -
                  <Badge variant={payroll.active ? "default" : "secondary"} className="ml-2">
                    {payroll.active ? "Active" : "Inactive"}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p>No payrolls associated with this client.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

