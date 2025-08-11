"use client";

import {
  UserCheck,
  UserPlus,
  Mail,
  Badge as BadgeIcon,
  Edit,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { memo, useState } from "react";
import { toast } from "sonner";
import { CanUpdate } from "@/components/auth/permission-guard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { PayrollData } from "@/domains/payrolls/hooks/usePayrollData";

export interface PayrollAssignmentsProps {
  data: PayrollData;
  loading?: boolean;
  onUpdateAssignments?: (assignments: {
    primaryConsultantUserId?: string;
    backupConsultantUserId?: string;
    managerUserId?: string;
  }) => Promise<void>;
}

// Helper function to generate user initials
function getUserInitials(user: any): string {
  if (!user) return "?";

  const name =
    user.computedName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim();
  if (!name || name === "Unknown User") return "U";

  const nameParts = name.split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return (
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
}

// Helper function to format user role
function formatRole(role: string): string {
  const roleMap = {
    org_admin: "Admin",
    manager: "Manager",
    consultant: "Consultant",
    developer: "Developer",
    viewer: "Viewer",
  };

  return (
    roleMap[role as keyof typeof roleMap] ||
    role.charAt(0).toUpperCase() + role.slice(1)
  );
}

// Helper function to get role badge variant
function getRoleBadgeVariant(
  role: string
): "default" | "secondary" | "outline" | "destructive" {
  const variants = {
    org_admin: "default" as const,
    manager: "default" as const,
    consultant: "secondary" as const,
    developer: "outline" as const,
    viewer: "outline" as const,
  };

  return variants[role as keyof typeof variants] || "outline";
}

// User card component
function UserCard({
  user,
  title,
  description,
  onEdit,
}: {
  user: any;
  title: string;
  description: string;
  onEdit?: () => void;
}) {
  const displayName =
    user?.computedName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Unknown User";

  if (!user) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-4">{description}</p>
          {onEdit && (
            <CanUpdate resource="payrolls">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <UserPlus className="w-4 h-4 mr-2" />
                Assign {title}
              </Button>
            </CanUpdate>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.image || undefined} alt={displayName} />
            <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">
                  {displayName}
                </h3>
                <p className="text-sm text-gray-500">{title}</p>
              </div>
              {onEdit && (
                <CanUpdate resource="payrolls">
                  <Button variant="ghost" size="sm" onClick={onEdit}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </CanUpdate>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  <BadgeIcon className="w-3 h-3 mr-1" />
                  {formatRole(user.role)}
                </Badge>
                {user.isActive ? (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-gray-500 border-gray-200"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Inactive
                  </Badge>
                )}
              </div>

              {user.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Assignment edit dialog component
function AssignmentEditDialog({
  open,
  onOpenChange,
  data,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PayrollData;
  onSave: (assignments: any) => Promise<void>;
}) {
  const [assignments, setAssignments] = useState({
    primaryConsultantUserId: data.payroll.primaryConsultant?.id || "",
    backupConsultantUserId: data.payroll.backupConsultant?.id || "",
    managerUserId: data.payroll.assignedManager?.id || "",
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(assignments);
      onOpenChange(false);
      toast.success("Assignments updated successfully");
    } catch (error) {
      console.error("Failed to update assignments:", error);
      toast.error("Failed to update assignments");
    } finally {
      setSaving(false);
    }
  };

  // Filter users by role for appropriate assignments
  const consultants = data.users.filter(
    user =>
      ["consultant", "manager", "org_admin", "developer"].includes(user.role) &&
      user.isActive
  );

  const managers = data.users.filter(
    user =>
      ["manager", "org_admin", "developer"].includes(user.role) && user.isActive
  );

  // Filter backup consultants to exclude primary consultant
  const backupConsultants = consultants.filter(
    user => user.id !== assignments.primaryConsultantUserId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Assignments</DialogTitle>
          <DialogDescription>
            Assign team members to this payroll. Changes will be saved
            immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="primary-consultant">Primary Consultant</Label>
            <Select
              value={assignments.primaryConsultantUserId}
              onValueChange={value =>
                setAssignments(prev => ({
                  ...prev,
                  primaryConsultantUserId: value,
                }))
              }
            >
              <SelectTrigger id="primary-consultant">
                <SelectValue placeholder="Select primary consultant..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No assignment</SelectItem>
                {consultants.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <span>
                        {user.computedName ||
                          `${user.firstName} ${user.lastName}`}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {formatRole(user.role)}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="backup-consultant">Backup Consultant</Label>
            <Select
              value={assignments.backupConsultantUserId}
              onValueChange={value =>
                setAssignments(prev => ({
                  ...prev,
                  backupConsultantUserId: value,
                }))
              }
            >
              <SelectTrigger id="backup-consultant">
                <SelectValue placeholder="Select backup consultant..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No assignment</SelectItem>
                {backupConsultants.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <span>
                        {user.computedName ||
                          `${user.firstName} ${user.lastName}`}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {formatRole(user.role)}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="manager">Manager</Label>
            <Select
              value={assignments.managerUserId}
              onValueChange={value =>
                setAssignments(prev => ({
                  ...prev,
                  managerUserId: value,
                }))
              }
            >
              <SelectTrigger id="manager">
                <SelectValue placeholder="Select manager..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No assignment</SelectItem>
                {managers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <span>
                        {user.computedName ||
                          `${user.firstName} ${user.lastName}`}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {formatRole(user.role)}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PayrollAssignmentsComponent({
  data,
  loading = false,
  onUpdateAssignments,
}: PayrollAssignmentsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  if (loading || !data) {
    return <PayrollAssignmentsSkeleton />;
  }

  const { payroll } = data;

  // Check for missing assignments
  const missingAssignments = [
    !payroll.primaryConsultant && "Primary Consultant",
    !payroll.assignedManager && "Manager",
  ].filter(Boolean);

  const handleUpdateAssignments = async (assignments: any) => {
    if (onUpdateAssignments) {
      await onUpdateAssignments(assignments);
    } else {
      toast.info("Assignment update functionality not implemented yet");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Team Assignments
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage consultant and manager assignments for this payroll
              </p>
            </div>

            <CanUpdate resource="payrolls">
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Assignments
                  </Button>
                </DialogTrigger>
                <AssignmentEditDialog
                  open={editDialogOpen}
                  onOpenChange={setEditDialogOpen}
                  data={data}
                  onSave={handleUpdateAssignments}
                />
              </Dialog>
            </CanUpdate>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Warning for missing assignments */}
          {missingAssignments.length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-amber-800">
                  <strong>Missing assignments:</strong>{" "}
                  {missingAssignments.join(", ")}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Assign team members to ensure proper payroll management and
                  oversight.
                </p>
              </div>
            </div>
          )}

          {/* Assignment cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UserCard
              user={payroll.primaryConsultant}
              title="Primary Consultant"
              description="Responsible for payroll processing and client communication"
              onEdit={() => setEditDialogOpen(true)}
            />

            <UserCard
              user={payroll.backupConsultant}
              title="Backup Consultant"
              description="Secondary consultant for support and coverage"
              onEdit={() => setEditDialogOpen(true)}
            />

            <UserCard
              user={payroll.assignedManager}
              title="Manager"
              description="Oversees payroll operations and approvals"
              onEdit={() => setEditDialogOpen(true)}
            />
          </div>

          {/* Required skills section */}
          {payroll.requiredSkills && payroll.requiredSkills.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {payroll.requiredSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill.skillName} ({skill.requiredLevel})
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Team members should have these skills for optimal payroll
                  management
                </p>
              </div>
            </>
          )}

          {/* Assignment history or notes could go here */}
          <Separator />
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Need to reassign team members? Use the "Edit Assignments" button
              above.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Loading skeleton component
function PayrollAssignmentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
          </div>
          <div className="h-9 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-dashed">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-36 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const PayrollAssignments = memo(PayrollAssignmentsComponent);
export default PayrollAssignments;
