// app/(dashboard)/onboarding/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function OnboardingPage() {
  const [activeTab, setActiveTab] = useState("clients");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Onboarding
        </h1>
        <p className="text-muted-foreground">
          Manage onboarding for new clients and payrolls
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="payrolls">Payrolls</TabsTrigger>
        </TabsList>
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Client Onboarding</CardTitle>
              <CardDescription>
                Manage the onboarding process for new clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input id="client-name" placeholder="Enter client name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-contact">Primary Contact</Label>
                  <Input
                    id="client-contact"
                    placeholder="Enter primary contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="Enter contact email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-notes">Onboarding Notes</Label>
                  <Textarea
                    id="client-notes"
                    placeholder="Enter any additional notes"
                  />
                </div>
                <Button type="submit">Start Onboarding</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payrolls">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Onboarding</CardTitle>
              <CardDescription>
                Set up new payrolls for existing clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payroll-client">Client</Label>
                  <Input id="payroll-client" placeholder="Select client" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payroll-name">Payroll Name</Label>
                  <Input id="payroll-name" placeholder="Enter payroll name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payroll-frequency">Frequency</Label>
                  <Input
                    id="payroll-frequency"
                    placeholder="Select frequency"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payroll-start-date">Start Date</Label>
                  <Input id="payroll-start-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payroll-notes">Onboarding Notes</Label>
                  <Textarea
                    id="payroll-notes"
                    placeholder="Enter any additional notes"
                  />
                </div>
                <Button type="submit">Start Payroll Setup</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
