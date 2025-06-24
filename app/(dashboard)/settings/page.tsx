// app/(dashboard)/settings/page.tsx
"use client";

import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRoleManagement } from "@/domains/users/components/user-role-management";
import { useAuthContext } from "@/lib/auth/auth-context";
import { useLayoutPreferences } from "@/lib/preferences/layout-preferences";

const roles = ["developer", "org_admin", "manager", "consultant", "viewer"];
const features = [
  { id: "create", name: "Create" },
  { id: "modify", name: "Modify" },
  { id: "delete", name: "Delete" },
  { id: "view", name: "View" },
];

export default function SettingsPage() {
  const { userRole, hasAdminAccess, isLoading: authLoading } = useAuthContext();
  const { layoutType, setLayoutType, sidebarCollapsed, setSidebarCollapsed, toggleSidebar } = useLayoutPreferences();
  const [isLoading, setIsLoading] = useState(false);
  const [roleAccess, setRoleAccess] = useState({
    admin: { create: true, modify: true, delete: true, view: true },
    org_admin: { create: true, modify: true, delete: true, view: true },
    manager: { create: true, modify: true, delete: false, view: true },
    consultant: { create: false, modify: true, delete: false, view: true },
    viewer: { create: false, modify: false, delete: false, view: true },
  });

  const handleToggle = (role: string, feature: string) => {
    setRoleAccess(prev => ({
      ...prev,
      [role]: {
        ...prev[role as keyof typeof prev],
        [feature]:
          !prev[role as keyof typeof prev][
            feature as keyof (typeof prev)[keyof typeof prev]
          ],
      },
    }));
  };

  const handleSave = async () => {
    // Here you would typically save the role access settings to your backend
    console.log("Role access settings:", roleAccess);
    // Implement API call to save settings
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate saving settings
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <div>Unauthorized - Admin access required</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure your organization and application settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Organization Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Organization Name</Label>
                      <Input id="org-name" defaultValue="Payroll Matrix Inc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-email">Email</Label>
                      <Input
                        id="org-email"
                        type="email"
                        defaultValue="admin@payrollmatrix.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-phone">Phone</Label>
                      <Input
                        id="org-phone"
                        type="tel"
                        defaultValue="(555) 987-6543"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-website">Website</Label>
                      <Input
                        id="org-website"
                        type="url"
                        defaultValue="https://payrollmatrix.com"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Application Settings</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select defaultValue="mm-dd-yyyy">
                        <SelectTrigger id="date-format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                          <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="utc-5">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc-8">
                            Pacific Time (UTC-8)
                          </SelectItem>
                          <SelectItem value="utc-7">
                            Mountain Time (UTC-7)
                          </SelectItem>
                          <SelectItem value="utc-6">
                            Central Time (UTC-6)
                          </SelectItem>
                          <SelectItem value="utc-5">
                            Eastern Time (UTC-5)
                          </SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="cad">CAD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="layout">
            <Card>
              <CardHeader>
                <CardTitle>Layout Preferences</CardTitle>
                <CardDescription>
                  Customize how the application interface is displayed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Navigation Layout</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="layout-sidebar">Sidebar Navigation</Label>
                        <p className="text-sm text-muted-foreground">
                          Use a fixed sidebar on the left for navigation
                        </p>
                      </div>
                      <Switch
                        id="layout-sidebar"
                        checked={layoutType === "sidebar"}
                        onCheckedChange={(checked) =>
                          setLayoutType(checked ? "sidebar" : "header")
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="layout-header">Header Navigation</Label>
                        <p className="text-sm text-muted-foreground">
                          Use a horizontal header bar for navigation
                        </p>
                      </div>
                      <Switch
                        id="layout-header"
                        checked={layoutType === "header"}
                        onCheckedChange={(checked) =>
                          setLayoutType(checked ? "header" : "sidebar")
                        }
                      />
                    </div>
                    {layoutType === "sidebar" && (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="sidebar-collapsed">Collapse Sidebar</Label>
                            <p className="text-sm text-muted-foreground">
                              Start with the sidebar collapsed to save space
                            </p>
                          </div>
                          <Switch
                            id="sidebar-collapsed"
                            checked={sidebarCollapsed}
                            onCheckedChange={setSidebarCollapsed}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Quick Toggle</Label>
                            <p className="text-sm text-muted-foreground">
                              Click to toggle sidebar immediately
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleSidebar}
                          >
                            {sidebarCollapsed ? "Expand" : "Collapse"} Sidebar
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Layout Options</h3>
                  <div className="space-y-2">
                    <Label htmlFor="layout-type">Navigation Style</Label>
                    <Select
                      value={layoutType}
                      onValueChange={(value: "sidebar" | "header") =>
                        setLayoutType(value)
                      }
                    >
                      <SelectTrigger id="layout-type">
                        <SelectValue placeholder="Select layout style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sidebar">
                          Sidebar Navigation
                        </SelectItem>
                        <SelectItem value="header">
                          Header Navigation
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Choose between sidebar or header-based navigation layout
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Current Settings</h3>
                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Navigation Layout:</span>
                      <span className="capitalize">{layoutType}</span>
                    </div>
                    {layoutType === "sidebar" && (
                      <div className="flex justify-between">
                        <span className="font-medium">Sidebar:</span>
                        <span>{sidebarCollapsed ? "Collapsed" : "Expanded"}</span>
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Your layout preferences are saved automatically when changed.
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  Layout changes take effect immediately. Your preferences are saved to your browser.
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-payroll">
                          Payroll Processing
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when payrolls are processed
                        </p>
                      </div>
                      <Switch id="email-payroll" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-reminders">
                          Payroll Reminders
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive reminders before payroll due dates
                        </p>
                      </div>
                      <Switch id="email-reminders" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-clients">Client Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when client information changes
                        </p>
                      </div>
                      <Switch id="email-clients" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-system">System Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about system updates and
                          maintenance
                        </p>
                      </div>
                      <Switch id="email-system" defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">In-App Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="app-payroll">Payroll Processing</Label>
                        <p className="text-sm text-muted-foreground">
                          Show notifications when payrolls are processed
                        </p>
                      </div>
                      <Switch id="app-payroll" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="app-reminders">Payroll Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Show reminders before payroll due dates
                        </p>
                      </div>
                      <Switch id="app-reminders" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="app-clients">Client Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Show notifications when client information changes
                        </p>
                      </div>
                      <Switch id="app-clients" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users & Roles</CardTitle>
                <CardDescription>
                  Manage users and their access permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserRoleManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security settings for your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password Policy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="password-expiry">Password Expiry</Label>
                        <p className="text-sm text-muted-foreground">
                          Require password change every 90 days
                        </p>
                      </div>
                      <Switch id="password-expiry" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="password-complexity">
                          Password Complexity
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Require complex passwords (uppercase, lowercase,
                          numbers, symbols)
                        </p>
                      </div>
                      <Switch id="password-complexity" defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Two-Factor Authentication
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa-required">Require 2FA</Label>
                        <p className="text-sm text-muted-foreground">
                          Require two-factor authentication for all users
                        </p>
                      </div>
                      <Switch id="2fa-required" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa-method">2FA Method</Label>
                        <p className="text-sm text-muted-foreground">
                          Select the preferred 2FA method
                        </p>
                      </div>
                      <Select defaultValue="app">
                        <SelectTrigger id="2fa-method" className="w-[180px]">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="app">Authenticator App</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Session Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="session-timeout">Session Timeout</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically log out inactive users
                        </p>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger
                          id="session-timeout"
                          className="w-[180px]"
                        >
                          <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
      <Card>
        <CardHeader>
          <CardTitle>Role Access Settings</CardTitle>
          <CardDescription>Toggle access rights for each role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roles.map(role => (
              <div key={role} className="space-y-2">
                <h3 className="text-lg font-medium capitalize">{role}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {features.map(feature => (
                    <div
                      key={feature.id}
                      className="flex items-center space-x-2"
                    >
                      <Switch
                        id={`${role}-${feature.id}`}
                        checked={
                          roleAccess[role as keyof typeof roleAccess][
                            feature.id as keyof (typeof roleAccess)[keyof typeof roleAccess]
                          ]
                        }
                        onCheckedChange={() => handleToggle(role, feature.id)}
                      />
                      <Label htmlFor={`${role}-${feature.id}`}>
                        {feature.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleSave} className="mt-6">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
