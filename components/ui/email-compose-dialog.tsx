"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface EmailComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  to?: string[];
  subject?: string;
  initialBody?: string;
  onSend?: (payload: {
    to: string[];
    subject: string;
    body: string;
  }) => Promise<void> | void;
}

export function EmailComposeDialog({
  open,
  onOpenChange,
  to = [],
  subject = "",
  initialBody = "",
  onSend,
}: EmailComposeDialogProps) {
  const [recipients, setRecipients] = useState<string>(to.join(", "));
  const [emailSubject, setEmailSubject] = useState<string>(subject);
  const [body, setBody] = useState<string>(initialBody);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const parsed = recipients
      .split(",")
      .map(r => r.trim())
      .filter(Boolean);
    try {
      setSending(true);
      await onSend?.({ to: parsed, subject: emailSubject.trim(), body });
      onOpenChange(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" /> Compose Email
          </DialogTitle>
          <DialogDescription>
            Send a quick email to related stakeholders
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <Input
              placeholder="user@example.com, other@example.com"
              value={recipients}
              onChange={e => setRecipients(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <Input
              placeholder="Subject"
              value={emailSubject}
              onChange={e => setEmailSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <Textarea
              rows={8}
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending || !recipients.trim()}
            >
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
