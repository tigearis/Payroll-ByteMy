"use client";

import { DeveloperOnly } from "@/components/auth/developer-only";
import { UnifiedDevDashboard } from "@/lib/dev";

export default function DevToolsPage() {
  return (
    <DeveloperOnly>
      <UnifiedDevDashboard />
    </DeveloperOnly>
  );
}