import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const urgentAlerts = [
  { id: 1, title: "Missing Timesheet", description: "Acme Inc. - Sales Team payroll is missing timesheet data." },
  { id: 2, title: "Approval Required", description: "TechCorp payroll needs manager approval before processing." },
  { id: 3, title: "Bank File Error", description: "Error in generating bank file for Global Foods payroll." },
]

export function UrgentAlerts() {
  return (
    <div className="space-y-4">
      {urgentAlerts.map((alert) => (
        <Alert key={alert.id} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}

