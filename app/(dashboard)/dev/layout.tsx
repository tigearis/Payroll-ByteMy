import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export default function DevLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/developer">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Developer Tools
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Development Tools</h1>
          <p className="text-gray-500">Developer utilities and component galleries</p>
        </div>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}