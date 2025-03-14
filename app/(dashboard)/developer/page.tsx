// app/(dashboard)/developer/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const features = [
  { id: "tax-calculator", name: "Tax Calculator", description: "Enable the Australian tax calculator feature" },
  {
    id: "multi-currency",
    name: "Multi-Currency Support",
    description: "Allow handling multiple currencies in payrolls",
  },
  { id: "advanced-reports", name: "Advanced Reporting", description: "Enable advanced payroll reporting features" },
  {
    id: "employee-portal",
    name: "Employee Self-Service Portal",
    description: "Provide a portal for employees to access their payroll information",
  },
]

export default function DeveloperPage() {
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([])

  const toggleFeature = (featureId: string) => {
    setEnabledFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId],
    )
  }

  const handleSave = () => {
    // Here you would typically save the enabled features to your backend
    console.log("Enabled features:", enabledFeatures)
    alert("Feature toggles saved!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Developer Settings</h2>
        <p className="text-muted-foreground">Manage feature toggles and developer options</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
          <CardDescription>Enable or disable features in the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={feature.id}>{feature.name}</Label>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <Switch
                  id={feature.id}
                  checked={enabledFeatures.includes(feature.id)}
                  onCheckedChange={() => toggleFeature(feature.id)}
                />
              </div>
            ))}
          </div>
          <Button onClick={handleSave} className="mt-6">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}