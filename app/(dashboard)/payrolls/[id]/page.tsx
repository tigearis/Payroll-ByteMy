import { notFound } from "next/navigation"
import { gql } from "@apollo/client"
import { apolloClient } from "@/lib/apollo-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const GET_PAYROLL = gql`
  query GetPayroll($id: ID!) {
    payroll(id: $id) {
      id
      name
      processing_days_before_eft
      active
      created_at
      updated_at
      client {
        name
      }
      primaryConsultant {
        name
      }
      backupConsultant {
        name
      }
      manager {
        name
      }
    }
  }
`

async function getPayroll(id: string) {
  const { data } = await apolloClient.query({
    query: GET_PAYROLL,
    variables: { id },
  })

  if (!data.payroll) notFound()
  return data.payroll
}

export default async function PayrollPage({ params }: { params: { id: string } }) {
  const payroll = await getPayroll(params.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payroll Details</h2>
        <p className="text-muted-foreground">Viewing details for payroll ID: {payroll.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{payroll.name}</CardTitle>
          <CardDescription>Client: {payroll.client.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant={payroll.active ? "default" : "secondary"}>{payroll.active ? "Active" : "Inactive"}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Primary Consultant:</span>
              <span>{payroll.primaryConsultant?.name || "Not assigned"}</span>
            </div>
            <div className="flex justify-between">
              <span>Backup Consultant:</span>
              <span>{payroll.backupConsultant?.name || "Not assigned"}</span>
            </div>
            <div className="flex justify-between">
              <span>Manager:</span>
              <span>{payroll.manager?.name || "Not assigned"}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Days Before EFT:</span>
              <span>{payroll.processing_days_before_eft}</span>
            </div>
            <div className="flex justify-between">
              <span>Created At:</span>
              <span>{new Date(payroll.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span>{new Date(payroll.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

