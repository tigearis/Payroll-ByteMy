"use client";

import { Command } from "cmdk";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { createPortal } from "react-dom";

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({
  open: controlledOpen,
  onOpenChange,
}: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const actualOpen = isControlled ? controlledOpen : open;

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isControlled) onOpenChange?.(!actualOpen);
        else setOpen(prev => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [actualOpen, isControlled, onOpenChange]);

  const close = () => {
    if (isControlled) onOpenChange?.(false);
    else setOpen(false);
  };

  const go = (href: string) => {
    close();
    router.push(href);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-start justify-center p-4 md:pt-24"
      style={{ display: actualOpen ? "flex" : "none" }}
      onClick={close}
    >
      <div
        className="w-full max-w-xl rounded-xl border bg-background shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <Command label="Global Command Palette" shouldFilter className="cmdk">
          <div className="relative border-b">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Command.Input
              autoFocus
              placeholder="Type a command or search…"
              className="w-full bg-transparent pl-10 pr-4 py-3 outline-none"
            />
          </div>
          <Command.List className="max-h-80 overflow-auto">
            <Command.Empty className="px-4 py-3 text-sm text-neutral-500">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigate">
              <Command.Item onSelect={() => go("/dashboard")}>
                Go to Dashboard
              </Command.Item>
              <Command.Item onSelect={() => go("/clients")}>
                Go to Clients
              </Command.Item>
              <Command.Item onSelect={() => go("/payrolls")}>
                Go to Payrolls
              </Command.Item>
              <Command.Item onSelect={() => go("/billing")}>
                Go to Billing
              </Command.Item>
              <Command.Item onSelect={() => go("/reports")}>
                Go to Reports
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Actions">
              <Command.Item onSelect={() => go("/payrolls/new")}>
                New Payroll
              </Command.Item>
              <Command.Item onSelect={() => go("/bulk-upload")}>
                Import Data
              </Command.Item>
              <Command.Item onSelect={() => go("/billing/invoices/new")}>
                Generate Invoice
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>,
    document.body
  );
}

export default CommandPalette;
