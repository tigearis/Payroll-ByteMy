"use client";

import Link from "next/link";
import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ClientCardProps {
  client: {
    id: any;
    name: string;
    contact_email: string;
    contact_person: string;
    contact_phone: string;
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
          <strong>Contact Person:</strong> {client.contact_person}
        </p>
        <p>
          <strong>Email:</strong> {client.contact_email}
        </p>
        <p>
          <strong>Phone:</strong> {client.contact_phone}
        </p>
      </CardContent>
    </Card>
  );
};
