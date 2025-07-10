"use client"

import { ReloadIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { CheckCircle } from "lucide-react"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ConnectionSetupProps {
  initialConfig?: {
    endpoint: string
    adminSecret: string
    role?: string
  }
  onSave: (config: { endpoint: string; adminSecret: string; role?: string }) => void
}

export function ConnectionSetup({ initialConfig, onSave }: ConnectionSetupProps) {
  const [endpoint, setEndpoint] = useState(initialConfig?.endpoint || "")
  const [adminSecret, setAdminSecret] = useState(initialConfig?.adminSecret || "")
  const [role, setRole] = useState(initialConfig?.role || "user")
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const testConnection = async () => {
    if (!endpoint || !adminSecret) {
      setErrorMessage("Please provide both endpoint and admin secret")
      setConnectionStatus("error")
      return
    }

    setIsTestingConnection(true)
    setConnectionStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint,
          adminSecret,
          role,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setConnectionStatus("success")
      } else {
        setConnectionStatus("error")
        setErrorMessage(result.error || "Connection failed")
      }
    } catch (error) {
      setConnectionStatus("error")
      setErrorMessage("Failed to test connection")
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleSave = () => {
    if (connectionStatus === "success") {
      onSave({ endpoint, adminSecret, role })
    } else {
      testConnection()
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Connect to Hasura</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="endpoint">GraphQL Endpoint</Label>
          <Input
            id="endpoint"
            type="url"
            placeholder="https://your-hasura-instance.hasura.app/v1/graphql"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminSecret">Admin Secret</Label>
          <Input
            id="adminSecret"
            type="password"
            placeholder="your-admin-secret"
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Default Role (Optional)</Label>
          <Input id="role" placeholder="user" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>

        {connectionStatus === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Connection successful! Your Hasura instance is ready.
            </AlertDescription>
          </Alert>
        )}

        {connectionStatus === "error" && (
          <Alert className="border-red-200 bg-red-50">
            <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={testConnection}
            disabled={isTestingConnection || !endpoint || !adminSecret}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            {isTestingConnection ? (
              <>
                <ReloadIcon className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>

          <Button onClick={handleSave} disabled={!endpoint || !adminSecret} className="flex-1">
            {connectionStatus === "success" ? "Save & Continue" : "Connect"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
