'use client'

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

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

export const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, className }) => {
  return (
    <Card className={`p-4 ${className || ""} shadow-md rounded-lg`}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-bold">Client Details</CardTitle>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Edit
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <strong>Name:</strong>{" "}
          <Link href={`/clients/${client.id}`} className="text-blue-600 hover:underline">
            {client.name}
          </Link>
        </p>
        <p><strong>Contact Person:</strong> {client.contact_person}</p>
        <p><strong>Email:</strong> {client.contact_email}</p>
        <p><strong>Phone:</strong> {client.contact_phone}</p>
      </CardContent>
    </Card>
  );
};
