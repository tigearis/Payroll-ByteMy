"use client";

import { useQuery } from "@apollo/client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GlobalSearchDocument } from "@/shared/types/generated/graphql";

interface GlobalSearchProps {
  className?: string;
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Debounce query
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  const { data, loading } = useQuery(GlobalSearchDocument, {
    skip: debouncedQuery.trim().length < 2,
    variables: { searchTerm: `%${debouncedQuery}%` },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
  });

  const groupedResults = useMemo(() => {
    return {
      clients: data?.clients ?? [],
      users: data?.users ?? [],
      payrolls: data?.payrolls ?? [],
    } as const;
  }, [data]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
    return () => {};
  }, [open]);

  const handleNavigate = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground opacity-50" />
      <Input
        placeholder="Search clients, payrolls, staff..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        className="pl-10 bg-muted border-0 focus-visible:ring-1"
      />

      {open && (debouncedQuery.trim().length >= 2 || loading) && (
        <div className="absolute left-0 right-0 mt-2 z-50">
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <div className="max-h-[420px] overflow-auto divide-y">
                {/* Clients */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground opacity-75 uppercase tracking-wide">
                      Clients
                    </span>
                    {!loading && (
                      <Badge variant="secondary">
                        {groupedResults.clients.length}
                      </Badge>
                    )}
                  </div>
                  {loading && (
                    <div className="text-sm text-foreground opacity-60">
                      Searching…
                    </div>
                  )}
                  {!loading && groupedResults.clients.length === 0 && (
                    <div className="text-sm text-foreground opacity-60">
                      No results
                    </div>
                  )}
                  <ul className="space-y-1">
                    {groupedResults.clients.map((c: any) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => handleNavigate(`/clients/${c.id}`)}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-muted/50"
                        >
                          <div className="font-medium">{c.name}</div>
                          {c.contactEmail && (
                            <div className="text-xs text-foreground opacity-60">
                              {c.contactEmail}
                            </div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Users */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground opacity-75 uppercase tracking-wide">
                      Users
                    </span>
                    {!loading && (
                      <Badge variant="secondary">
                        {groupedResults.users.length}
                      </Badge>
                    )}
                  </div>
                  {loading && (
                    <div className="text-sm text-foreground opacity-60">
                      Searching…
                    </div>
                  )}
                  {!loading && groupedResults.users.length === 0 && (
                    <div className="text-sm text-foreground opacity-60">
                      No results
                    </div>
                  )}
                  <ul className="space-y-1">
                    {groupedResults.users.map((u: any) => (
                      <li key={u.id}>
                        <button
                          type="button"
                          onClick={() => handleNavigate(`/staff/${u.id}`)}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-muted/50"
                        >
                          <div className="font-medium">
                            {u.computedName ??
                              `${u.firstName ?? ""} ${u.lastName ?? ""}`}
                          </div>
                          {u.email && (
                            <div className="text-xs text-foreground opacity-60">
                              {u.email}
                            </div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Payrolls */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground opacity-75 uppercase tracking-wide">
                      Payrolls
                    </span>
                    {!loading && (
                      <Badge variant="secondary">
                        {groupedResults.payrolls.length}
                      </Badge>
                    )}
                  </div>
                  {loading && (
                    <div className="text-sm text-foreground opacity-60">
                      Searching…
                    </div>
                  )}
                  {!loading && groupedResults.payrolls.length === 0 && (
                    <div className="text-sm text-foreground opacity-60">
                      No results
                    </div>
                  )}
                  <ul className="space-y-1">
                    {groupedResults.payrolls.map((p: any) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => handleNavigate(`/payrolls/${p.id}`)}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-muted/50"
                        >
                          <div className="font-medium">
                            {p.client?.name
                              ? `${p.client.name} – ${p.name}`
                              : p.name}
                          </div>
                          {p.status && (
                            <div className="text-xs text-foreground opacity-60">
                              Status: {p.status}
                            </div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
