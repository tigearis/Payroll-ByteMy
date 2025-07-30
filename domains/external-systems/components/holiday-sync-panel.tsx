"use client";

import { Calendar, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ByteMySpinner } from "@/components/ui/bytemy-loading-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SyncResult {
  success: boolean;
  message?: string;
  details?: {
    totalAffected: number;
    skippedCount?: number;
    forceSync: boolean;
    userId: string;
    results?: Array<{
      year: number;
      count: number;
      message: string;
    }>;
  };
  error?: string;
}

export function HolidaySyncPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [forceSync, setForceSync] = useState(false);
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const handleSync = async () => {
    setIsLoading(true);
    setLastResult(null);

    try {
      const response = await fetch('/api/holidays/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force: forceSync }),
      });

      const result: SyncResult = await response.json();
      setLastResult(result);
      
      if (result.success) {
        setLastSyncTime(new Date().toLocaleString());
      }
    } catch (error) {
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getResultIcon = () => {
    if (!lastResult) return null;
    
    if (lastResult.success) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getResultVariant = () => {
    if (!lastResult) return "default";
    return lastResult.success ? "default" : "destructive";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle className="text-lg">Australian Holiday Sync</CardTitle>
            <CardDescription>
              Sync comprehensive Australian public holidays from data.gov.au
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-auto">
            NSW + National
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Last Sync Info */}
        {lastSyncTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last synced: {lastSyncTime}</span>
          </div>
        )}

        {/* Force Sync Option */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="force-sync"
            checked={forceSync}
            onCheckedChange={(checked) => setForceSync(checked as boolean)}
            disabled={isLoading}
          />
          <label
            htmlFor="force-sync"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Force sync (override existing holidays)
          </label>
        </div>

        {/* Sync Button */}
        <Button 
          onClick={handleSync} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <ByteMySpinner size="sm" className="mr-2" />
              Syncing holidays...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Australian Holidays
            </>
          )}
        </Button>

        {/* Results Display */}
        {lastResult && (
          <Alert variant={getResultVariant()}>
            <div className="flex items-start gap-2">
              {getResultIcon()}
              <div className="flex-1">
                <AlertDescription>
                  {lastResult.success ? (
                    <div className="space-y-2">
                      <div className="font-medium text-green-800">
                        {lastResult.message || "Holiday sync completed successfully"}
                      </div>
                      {lastResult.details && (
                        <div className="text-sm space-y-1">
                          <div>
                            <span className="font-medium">Total processed:</span>{" "}
                            {lastResult.details.totalAffected} holidays
                          </div>
                          {lastResult.details.skippedCount !== undefined && (
                            <div>
                              <span className="font-medium">Skipped:</span>{" "}
                              {lastResult.details.skippedCount} (already exist)
                            </div>
                          )}
                          {lastResult.details.results && (
                            <div className="mt-2">
                              <div className="font-medium">Year breakdown:</div>
                              {lastResult.details.results.map((yearResult, index) => (
                                <div key={index} className="ml-2">
                                  {yearResult.year}: {yearResult.count} holidays - {yearResult.message}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="font-medium text-red-800">
                        Holiday sync failed
                      </div>
                      <div className="text-sm">
                        {lastResult.error || 
                         (typeof lastResult.details === 'string' ? lastResult.details : JSON.stringify(lastResult.details)) || 
                         "Unknown error occurred"}
                      </div>
                    </div>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {/* Help Text */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg space-y-1">
          <div className="font-medium">Holiday Sync Details:</div>
          <div>• Fetches comprehensive Australian holidays from data.gov.au</div>
          <div>• Stores all states for reference (NSW, VIC, QLD, SA, WA, TAS, NT, ACT)</div>
          <div>• Only NSW + National holidays affect EFT date adjustments</div>
          <div>• Force sync will replace existing holidays for the current year</div>
        </div>
      </CardContent>
    </Card>
  );
}