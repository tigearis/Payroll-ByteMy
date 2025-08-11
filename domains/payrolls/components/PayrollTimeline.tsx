"use client";

import { format, isToday, isTomorrow, isPast, differenceInDays } from "date-fns";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { memo, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Note: Using simple hover effects instead of complex tooltip system for now
import { Separator } from "@/components/ui/separator";
import type { PayrollData } from "@/domains/payrolls/hooks/usePayrollData";
import { cn } from "@/lib/utils";

export interface PayrollTimelineProps {
  data: PayrollData;
  loading?: boolean;
  maxDates?: number;
}

interface TimelineEvent {
  id: string;
  type: 'payroll' | 'processing' | 'holiday' | 'milestone';
  date: Date;
  originalDate?: Date;
  title: string;
  description?: string;
  status: 'completed' | 'upcoming' | 'current' | 'overdue';
  notes?: string;
  isAdjusted?: boolean;
  icon: React.ElementType;
  color: string;
}

// Helper function to determine event status
function getEventStatus(date: Date): 'completed' | 'upcoming' | 'current' | 'overdue' {
  const now = new Date();
  if (isToday(date)) return 'current';
  if (isPast(date)) return 'completed';
  return 'upcoming';
}

// Helper function to get relative date description
function getRelativeDate(date: Date): string {
  const now = new Date();
  const diffDays = differenceInDays(date, now);
  
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} day${diffDays === 1 ? '' : 's'}`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} day${diffDays === -1 ? '' : 's'} ago`;
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  return `In ${diffDays} days`;
}

// Helper function to format date for display
function formatDisplayDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

// Helper function to get timeline event styling
function getEventStyling(status: string, type: string) {
  const baseStyles = "relative flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:shadow-md";
  
  const statusStyles = {
    completed: "bg-gray-50 border border-gray-200",
    current: "bg-blue-50 border border-blue-200 shadow-sm",
    upcoming: "bg-white border border-gray-200 hover:border-gray-300",
    overdue: "bg-red-50 border border-red-200",
  };

  return cn(baseStyles, statusStyles[status as keyof typeof statusStyles]);
}

// Helper function to get icon styling
function getIconStyling(status: string, type: string) {
  const baseStyles = "w-10 h-10 rounded-full flex items-center justify-center shrink-0";
  
  const statusStyles = {
    completed: "bg-green-100 text-green-600",
    current: "bg-blue-100 text-blue-600",
    upcoming: "bg-gray-100 text-gray-600",
    overdue: "bg-red-100 text-red-600",
  };

  return cn(baseStyles, statusStyles[status as keyof typeof statusStyles]);
}

// Timeline event component
function TimelineEvent({ 
  event, 
  isLast = false 
}: { 
  event: TimelineEvent; 
  isLast?: boolean;
}) {
  const IconComponent = event.icon;
  
  return (
    <div className="relative">
        <div className={getEventStyling(event.status, event.type)}>
          {/* Event Icon */}
          <div className={getIconStyling(event.status, event.type)}>
            <IconComponent className="w-5 h-5" />
          </div>

          {/* Event Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {event.title}
                  </h3>
                  {event.isAdjusted && (
                    <div title="Date adjusted for holiday/weekend">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    </div>
                  )}
                </div>

                {event.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {event.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDisplayDate(event.date)}</span>
                  </div>
                  <Badge 
                    variant={event.status === 'current' ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {getRelativeDate(event.date)}
                  </Badge>
                </div>

                {event.notes && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                    <div className="flex items-start gap-1">
                      <Info className="w-3 h-3 mt-0.5 shrink-0" />
                      <span>{event.notes}</span>
                    </div>
                  </div>
                )}

                {event.originalDate && event.originalDate.getTime() !== event.date.getTime() && (
                  <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <span>Originally {formatDisplayDate(event.originalDate)}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>Moved to {formatDisplayDate(event.date)}</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              {event.status === 'upcoming' && (
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Connecting Line */}
        {!isLast && (
          <div className="absolute left-9 top-16 w-px h-8 bg-gray-200" />
        )}
      </div>
  );
}

// Timeline summary component
function TimelineSummary({ events }: { events: TimelineEvent[] }) {
  const stats = useMemo(() => {
    const total = events.length;
    const completed = events.filter(e => e.status === 'completed').length;
    const upcoming = events.filter(e => e.status === 'upcoming').length;
    const current = events.filter(e => e.status === 'current').length;
    const overdue = events.filter(e => e.status === 'overdue').length;

    const nextEvent = events.find(e => e.status === 'current' || e.status === 'upcoming');
    
    return {
      total,
      completed,
      upcoming,
      current,
      overdue,
      nextEvent,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [events]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">Completed</span>
        </div>
        <div className="text-2xl font-bold text-green-900">{stats.completed}</div>
        <div className="text-xs text-green-600">
          {stats.completionRate}% completion rate
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Upcoming</span>
        </div>
        <div className="text-2xl font-bold text-blue-900">{stats.upcoming}</div>
        <div className="text-xs text-blue-600">
          Scheduled dates
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">Progress</span>
        </div>
        <div className="text-2xl font-bold text-amber-900">{stats.completionRate}%</div>
        <div className="text-xs text-amber-600">
          Overall timeline
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-800">Next Date</span>
        </div>
        <div className="text-lg font-bold text-gray-900">
          {stats.nextEvent ? formatDisplayDate(stats.nextEvent.date) : 'None'}
        </div>
        <div className="text-xs text-gray-600">
          {stats.nextEvent ? getRelativeDate(stats.nextEvent.date) : 'All caught up'}
        </div>
      </div>
    </div>
  );
}

function PayrollTimelineComponent({ 
  data, 
  loading = false, 
  maxDates = 12 
}: PayrollTimelineProps) {
  const [viewMode, setViewMode] = useState<'upcoming' | 'all' | 'past'>('upcoming');

  // Convert payroll dates to timeline events
  const timelineEvents = useMemo(() => {
    if (!data?.payroll?.detailPayrollDates) return [];

    const events: TimelineEvent[] = data.payroll.detailPayrollDates
      .slice(0, maxDates)
      .map(dateItem => {
        const adjustedDate = new Date(dateItem.adjustedEftDate || dateItem.originalEftDate);
        const originalDate = dateItem.originalEftDate ? new Date(dateItem.originalEftDate) : undefined;
        const processingDate = dateItem.processingDate ? new Date(dateItem.processingDate) : undefined;
        
        const isAdjusted = originalDate && adjustedDate.getTime() !== originalDate.getTime();
        const status = getEventStatus(adjustedDate);

        // Create payroll event
        const payrollEvent: TimelineEvent = {
          id: dateItem.id,
          type: 'payroll',
          date: adjustedDate,
          originalDate,
          title: 'Payroll EFT Date',
          description: 'Employee payments processed',
          status,
          notes: dateItem.notes || undefined,
          isAdjusted,
          icon: Calendar,
          color: status === 'current' ? 'blue' : status === 'completed' ? 'green' : 'gray',
        };

        const events = [payrollEvent];

        // Add processing date if different
        if (processingDate && processingDate.getTime() !== adjustedDate.getTime()) {
          events.push({
            id: `${dateItem.id}-processing`,
            type: 'processing',
            date: processingDate,
            title: 'Processing Date',
            description: 'Internal payroll processing',
            status: getEventStatus(processingDate),
            icon: Clock,
            color: 'orange',
          });
        }

        return events;
      })
      .flat()
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return events;
  }, [data?.payroll?.detailPayrollDates, maxDates]);

  // Filter events based on view mode
  const filteredEvents = useMemo(() => {
    switch (viewMode) {
      case 'upcoming':
        return timelineEvents.filter(e => e.status === 'upcoming' || e.status === 'current');
      case 'past':
        return timelineEvents.filter(e => e.status === 'completed');
      case 'all':
      default:
        return timelineEvents;
    }
  }, [timelineEvents, viewMode]);

  if (loading || !data) {
    return <PayrollTimelineSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Payroll Timeline
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Visual timeline of payroll dates and processing milestones
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-md p-1">
              {(['upcoming', 'all', 'past'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs capitalize px-3 py-1"
                  onClick={() => setViewMode(mode)}
                >
                  {mode}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {timelineEvents.length > 0 && <TimelineSummary events={timelineEvents} />}
        
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {viewMode} dates found
            </h3>
            <p className="text-gray-600 mb-4">
              {viewMode === 'upcoming' 
                ? 'There are no upcoming payroll dates scheduled'
                : viewMode === 'past'
                ? 'No past payroll dates to display'
                : 'No payroll dates have been generated yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <TimelineEvent
                key={event.id}
                event={event}
                isLast={index === filteredEvents.length - 1}
              />
            ))}
          </div>
        )}

        {viewMode === 'upcoming' && filteredEvents.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Showing next {filteredEvents.length} dates</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode('all')}
                className="text-blue-600 hover:text-blue-700"
              >
                View all dates →
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Loading skeleton
function PayrollTimelineSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse mb-2" />
              <div className="h-8 bg-gray-200 rounded w-12 animate-pulse mb-1" />
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Timeline events skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse mb-2" />
                <div className="flex items-center gap-4">
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
                  <div className="h-5 bg-gray-200 rounded w-16 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const PayrollTimeline = memo(PayrollTimelineComponent);
export default PayrollTimeline;