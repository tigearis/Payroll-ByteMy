"use client";

import { useQuery } from "@apollo/client";

import { UserDetails } from "@/types/interface";

import { gql } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";

// Import extracted GraphQL operations (simplified version)
const GET_STAFF_BY_ID = gql`
  query GetStaffById($id: uuid!) {
    users_by_pk(id: $id) {
      id
      name
      email
      role
      created_at
      updated_at
    }
  }
`;
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";

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
  const { hasAdminAccess, isManager, isDeveloper, isConsultant } =
    useUserRole();
  const { loading, error, data } = useQuery(GET_STAFF_BY_ID, {
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

  const user = data.users.find((u: UserDetails) => u.id === id);
  if (!user) {
    return <p>User not found.</p>;
  }

  const canEditLeave =
    hasAdminAccess || isManager || isDeveloper || isConsultant;

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
              {user.leavedates.length > 0
                ? user.leavedates.map(
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
