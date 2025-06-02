"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { UserDetails } from "@/types/interface";
import { GET_STAFF_BY_ID } from "@/graphql/queries/staff/getStaffById";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";

export default function UserInfoPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { isAdmin, isManager, isDeveloper, isConsultant } = useUserRole();
  const { loading, error, data } = useQuery(GET_STAFF_BY_ID, {
    variables: { id },
    skip: !id, // Skip query if id is not available
  });

  if (!id) return <p>Loading...</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading user data.</p>;

  const user = data.users.find((u: UserDetails) => u.id === id);
  if (!user) return <p>User not found.</p>;

  const canEditLeave = isAdmin || isManager || isDeveloper || isConsultant;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">{user.name}'s Profile</h2>

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
              {user.leave_dates.length > 0
                ? user.leave_dates.map(
                    (leave: {
                      id: Key | null | undefined;
                      start_date:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      end_date:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                    }) => (
                      <p key={leave.id}>
                        {leave.start_date} - {leave.end_date}
                      </p>
                    )
                  )
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
