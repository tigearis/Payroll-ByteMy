"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export interface ExportDataDialogProps<TFilter = any> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filename?: string;
  onExport: (options: {
    filename: string;
    filter?: TFilter;
  }) => Promise<void> | void;
  filterControl?: React.ReactNode;
}

export function ExportDataDialog<TFilter = any>({
  open,
  onOpenChange,
  filename = "export.csv",
  onExport,
  filterControl,
}: ExportDataDialogProps<TFilter>) {
  const [name, setName] = useState(filename);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      await onExport({ filename: name });
      onOpenChange(false);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" /> Export Data
          </DialogTitle>
          <DialogDescription>
            Export the current view to a file
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Filename</label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          {filterControl}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={exporting}
            >
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={exporting || !name.trim()}>
              {exporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
