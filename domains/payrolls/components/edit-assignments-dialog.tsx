"use client";

import { useMutation, useQuery } from "@apollo/client";
import { UserCheck, Loader2, Edit } from "lucide-react";
import { useState, memo } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { 
  UpdatePayrollAssignmentsDocument,
  GetPayrollByIdDocument,
} from "@/domains/payrolls/graphql/generated/graphql";
import { GetUsersForDropdownDomainDocument } from "@/domains/users/graphql/generated/graphql";
import { handleGraphQLError } from "@/lib/utils/handle-graphql-error";

interface EditAssignmentsDialogProps {
  payroll: {
    id: string;
    primaryConsultantUserId?: string | null;
    backupConsultantUserId?: string | null;
    managerUserId?: string | null;
  };
  onSuccess?: () => void;
}

const EditAssignmentsDialogComponent: React.FC<EditAssignmentsDialogProps> = ({
  payroll,
  onSuccess,
}) => {
  const [primaryConsultantUserId, setPrimaryConsultantUserId] = useState(
    payroll.primaryConsultantUserId || ""
  );
  const [backupConsultantUserId, setBackupConsultantUserId] = useState(
    payroll.backupConsultantUserId || ""
  );
  const [managerUserId, setManagerUserId] = useState(
    payroll.managerUserId || ""
  );
  const [isOpen, setIsOpen] = useState(false);

  // Fetch users for dropdowns
  const { data: usersData, loading: usersLoading } = useQuery(
    GetUsersForDropdownDomainDocument,
    {
      errorPolicy: "all", // Continue with partial data if there are non-critical errors
    }
  );

  // Set up the mutation
  const [updateAssignments, { loading, error }] = useMutation(
    UpdatePayrollAssignmentsDocument,
    {
      refetchQueries: [
        { query: GetPayrollByIdDocument, variables: { id: payroll.id } },
      ],
      awaitRefetchQueries: true,
      onCompleted: () => {
        toast.success("Assignments updated successfully");
        setIsOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (error) => {
        const errorDetails = handleGraphQLError(error);
        toast.error(`Failed to update assignments: ${errorDetails.userMessage}`);
        console.error("Assignment update error:", errorDetails);
      },
    }
  );

  const users = usersData?.users || [];

  // Filter users by role
  const consultants = users.filter(user => 
    user.role === "consultant" || user.role === "manager" || user.role === "org_admin"
  );
  const managers = users.filter(user => 
    user.role === "manager" || user.role === "org_admin"
  );

  const getUserInitials = (user: any): string => {
    if (!user) return "?";
    const name = user.computedName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
    if (!name) return "U";
    const nameParts = name.split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const handleSave = async () => {
    try {
      await updateAssignments({
        variables: {
          id: payroll.id,
          primaryConsultantUserId: primaryConsultantUserId || null,
          backupConsultantUserId: backupConsultantUserId || null,
          managerUserId: managerUserId || null,
        },
      });
    } catch (err) {
      // Error handling is done in the onError callback
      console.error("Error in handleSave:", err);
    }
  };

  const hasChanges = () => {
    return (
      primaryConsultantUserId !== (payroll.primaryConsultantUserId || "") ||
      backupConsultantUserId !== (payroll.backupConsultantUserId || "") ||
      managerUserId !== (payroll.managerUserId || "")
    );
  };

  const resetForm = () => {
    setPrimaryConsultantUserId(payroll.primaryConsultantUserId || "");
    setBackupConsultantUserId(payroll.backupConsultantUserId || "");
    setManagerUserId(payroll.managerUserId || "");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm(); // Reset form when closing
    }
    setIsOpen(open);
  };

  const renderUserOption = (user: any) => (
    <SelectItem key={user.id} value={user.id}>
      <div className="flex items-center gap-2">
        <Avatar className="w-6 h-6">
          <AvatarImage src={user.image || undefined} alt={user.computedName || "User"} />
          <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
            {getUserInitials(user)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {user.computedName || `${user.firstName} ${user.lastName}`.trim()}
          </span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      </div>
    </SelectItem>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit Assignments
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Edit Team Assignments
          </DialogTitle>
          <DialogDescription>
            Update the consultant and manager assignments for this payroll.
          </DialogDescription>
        </DialogHeader>

        {usersLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading users...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary-consultant">Primary Consultant</Label>
              <Select
                value={primaryConsultantUserId}
                onValueChange={setPrimaryConsultantUserId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select primary consultant..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    <span className="text-muted-foreground">No consultant assigned</span>
                  </SelectItem>
                  {consultants.map(renderUserOption)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backup-consultant">Backup Consultant</Label>
              <Select
                value={backupConsultantUserId}
                onValueChange={setBackupConsultantUserId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select backup consultant..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    <span className="text-muted-foreground">No backup consultant</span>
                  </SelectItem>
                  {consultants.map(renderUserOption)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Select
                value={managerUserId}
                onValueChange={setManagerUserId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select manager..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    <span className="text-muted-foreground">No manager assigned</span>
                  </SelectItem>
                  {managers.map(renderUserOption)}
                </SelectContent>
              </Select>
            </div>

            {primaryConsultantUserId && backupConsultantUserId && primaryConsultantUserId === backupConsultantUserId && (
              <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                ⚠️ Primary and backup consultant are the same person. Consider assigning different consultants for better coverage.
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading || usersLoading || !hasChanges()}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {error && (
          <div className="mt-2 text-red-500 text-sm">{error.message}</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Performance optimized export with React.memo
function areEditAssignmentsDialogPropsEqual(
  prevProps: EditAssignmentsDialogProps,
  nextProps: EditAssignmentsDialogProps
): boolean {
  return (
    prevProps.payroll.id === nextProps.payroll.id &&
    prevProps.payroll.primaryConsultantUserId === nextProps.payroll.primaryConsultantUserId &&
    prevProps.payroll.backupConsultantUserId === nextProps.payroll.backupConsultantUserId &&
    prevProps.payroll.managerUserId === nextProps.payroll.managerUserId
  );
}

export const EditAssignmentsDialog = memo(
  EditAssignmentsDialogComponent,
  areEditAssignmentsDialogPropsEqual
);