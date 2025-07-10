"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StaffManagementContentProps {
  onAddStaff: () => void;
  onEditStaff: (staffId: string) => void;
}

export function StaffManagementContent({
  onAddStaff,
}: StaffManagementContentProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">
            Staff management system being rebuilt
          </p>
        </div>
        <Button onClick={onAddStaff}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff System</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The staff management system is being rebuilt after permissions removal. 
            This page will display and manage staff members once complete.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}