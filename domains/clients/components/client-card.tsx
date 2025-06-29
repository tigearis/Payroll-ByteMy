"use client";

import Link from "next/link";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ClientCardProps {
  client: {
    id: any;
    name: string;
    contactEmail: string;
    contactPerson: string;
    contactPhone: string;
    active?: boolean;
    payrollsAggregate?: {
      aggregate?: {
        count?: number;
      };
    };
  };
  onEdit?: () => void; // Optional edit handler
  className?: string; // Allow custom styles
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onEdit,
  className,
}) => {
  return (
    <Card className={className || ""}>
      <CardHeader className="flex justify-between items-center pb-3">
        <CardTitle className="text-lg font-bold">Client Details</CardTitle>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Edit
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <strong>Name:</strong>{" "}
          <Link
            href={`/clients/${client.id}`}
            className="text-primary hover:underline"
          >
            {client.name}
          </Link>
        </p>
        <p>
          <strong>Contact Person:</strong> {client.contactPerson}
        </p>
        <p>
          <strong>Email:</strong> {client.contactEmail}
        </p>
        <p>
          <strong>Phone:</strong> {client.contactPhone}
        </p>
      </CardContent>
    </Card>
  );
};
