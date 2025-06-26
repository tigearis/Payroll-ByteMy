"use client";

import { useRouter, useParams } from "next/navigation";

import { useQuery } from "@apollo/client";
import { GetStaffByIdDocument } from "@/domains/users/graphql/generated/graphql";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { useUserRole } from "@/hooks/use-user-role";

export default function UserInfoPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { hasPermission } = useUserRole();

  const { loading, error, data } = useQuery(GetStaffByIdDocument, {
    variables: { id },
    skip: !id, // Skip query if id is not available
  });

  if (!id) {
    return <p>Loading...</p>;
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error loading user data.</p>;
  }

  const user = data?.userById;
  if (!user) {
    return <p>User not found.</p>;
  }

  const canEditLeave = hasPermission("staff:write");

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">
        {user.name}&apos;s Profile
      </h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Leave Dates</TableCell>
            {canEditLeave && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              {(user as any).leaves && (user as any).leaves.length > 0
                ? (user as any).leaves.map((leaveRecord: any) => (
                    <p key={leaveRecord.id}>
                      {leaveRecord.startDate} - {leaveRecord.endDate}
                    </p>
                  ))
                : "No leave dates"}
            </TableCell>
            {canEditLeave && (
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/users/${id}/add-leave`)}
                >
                  Add Leave
                </Button>
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
