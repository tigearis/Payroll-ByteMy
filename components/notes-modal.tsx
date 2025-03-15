// components/notes-modal.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface NotesModalProps {
  note: string | null;
}

export const NotesModal: React.FC<NotesModalProps> = ({ note }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
        View Note
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Note</DialogTitle>
      </DialogHeader>
      <div>{note || 'No note available.'}</div>
    </DialogContent>
  </Dialog>
);
