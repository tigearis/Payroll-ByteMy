'use client';

import { useMutation, useQuery } from '@apollo/client';
import { Plus, Trash2, Save, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  GetTimeEntriesByPayrollDocument,
  CreateMultipleTimeEntriesDocument
} from '../../../billing/graphql/generated/graphql';

interface TimeEntry {
  id?: string;
  work_date: string;
  hours_spent: number;
  description: string;
}

interface TimeEntryModalProps {
  payrollId: string;
  clientId: string;
  onClose: () => void;
  onTimeEntriesUpdate: (entries: TimeEntry[], totalHours: number) => void;
}

export const TimeEntryModal: React.FC<TimeEntryModalProps> = ({
  payrollId,
  clientId,
  onClose,
  onTimeEntriesUpdate
}) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [newEntry, setNewEntry] = useState<TimeEntry>({
    work_date: new Date().toISOString().split('T')[0],
    hours_spent: 0,
    description: ''
  });

  // Get existing time entries for this payroll
  const { data: existingEntries } = useQuery(GetTimeEntriesDocument, {
    variables: {
      payrollId,
      clientId
    }
  });

  const [createTimeEntries] = useMutation(CreateMultipleTimeEntriesDocument);

  useEffect(() => {
    if (existingEntries?.time_entries) {
      const entries = existingEntries.timeentries.map(entry => ({
        id: entry.id,
        work_date: entry.work_date,
        hours_spent: entry.hours_spent,
        description: entry.description || ''
      }));
      setTimeEntries(entries);
    }
  }, [existingEntries]);

  const addTimeEntry = () => {
    if (!newEntry.work_date || newEntry.hours_spent <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setTimeEntries(prev => [...prev, { ...newEntry }]);
    setNewEntry({
      work_date: new Date().toISOString().split('T')[0],
      hours_spent: 0,
      description: ''
    });
  };

  const removeTimeEntry = (index: number) => {
    setTimeEntries(prev => prev.filter((_, i) => i !== index));
  };

  const updateTimeEntry = (index: number, field: keyof TimeEntry, value: any) => {
    setTimeEntries(prev =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const calculateTotalHours = () => {
    return timeEntries.reduce((total, entry) => total + entry.hours_spent, 0);
  };

  const handleSave = async () => {
    // Filter out existing entries (ones with IDs) and only save new ones
    const newEntries = timeEntries.filter(entry => !entry.id);
    
    if (newEntries.length === 0) {
      // Just update parent with current entries
      onTimeEntriesUpdate(timeEntries, calculateTotalHours());
      onClose();
      return;
    }

    try {
      const entriesToCreate = newEntries.map(entry => ({
        staff_user_id: '', // Will be set from current user context
        client_id: clientId,
        payroll_id: payrollId,
        work_date: entry.work_date,
        hours_spent: entry.hours_spent,
        description: entry.description
      }));

      await createTimeEntries({
        variables: {
          entries: entriesToCreate
        }
      });

      toast.success('Time entries saved successfully');
      onTimeEntriesUpdate(timeEntries, calculateTotalHours());
      onClose();
    } catch (error) {
      toast.error('Failed to save time entries');
      console.error('Time entries save error:', error);
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Time Tracking</DialogTitle>
          <DialogDescription>
            Log time spent on this payroll job for profitability analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Entry Form */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium mb-3">Add Time Entry</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="work_date">Date</Label>
                <Input
                  id="work_date"
                  type="date"
                  value={newEntry.work_date}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, work_date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="hours_spent">Hours</Label>
                <Input
                  id="hours_spent"
                  type="number"
                  step="0.25"
                  min="0"
                  max="24"
                  value={newEntry.hours_spent || ''}
                  onChange={(e) => setNewEntry(prev => ({ 
                    ...prev, 
                    hours_spent: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="0.0"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="description"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What work was performed..."
                    rows={1}
                    className="min-h-10"
                  />
                  <Button onClick={addTimeEntry} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Time Entries Table */}
          {timeEntries.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Time Entries</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          type="date"
                          value={entry.work_date}
                          onChange={(e) => updateTimeEntry(index, 'work_date', e.target.value)}
                          disabled={!!entry.id} // Disable editing existing entries
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.25"
                          min="0"
                          max="24"
                          value={entry.hours_spent}
                          onChange={(e) => updateTimeEntry(index, 'hours_spent', parseFloat(e.target.value) || 0)}
                          disabled={!!entry.id} // Disable editing existing entries
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={entry.description}
                          onChange={(e) => updateTimeEntry(index, 'description', e.target.value)}
                          disabled={!!entry.id} // Disable editing existing entries
                          rows={1}
                          className="min-h-8"
                        />
                      </TableCell>
                      <TableCell>
                        {!entry.id && ( // Only show delete for new entries
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeEntry(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Time Entries</p>
                <p className="text-lg font-semibold">{timeEntries.length} entries</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-blue-600">
                  {calculateTotalHours().toFixed(2)}h
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Time Entries
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};