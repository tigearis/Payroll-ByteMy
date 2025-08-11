"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function GlobalSearch() {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search..."
        className="pl-8 bg-background/50"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // Handle search
            console.log("Search:", e.currentTarget.value);
          }
        }}
      />
    </div>
  );
}