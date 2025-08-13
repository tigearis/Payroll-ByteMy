"use client";

import { useState, useEffect } from "react";
import { Clock, Timer, Calculator, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SixMinuteTimeInputProps {
  value: number; // Value in 6-minute units
  onChange: (units: number) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  showConversion?: boolean;
  showPreset?: boolean;
  className?: string;
}

// Common time presets in 6-minute units
const TIME_PRESETS = [
  { label: "15min", units: 2.5, display: "2.5 units" },
  { label: "30min", units: 5, display: "5 units" },
  { label: "45min", units: 7.5, display: "7.5 units" },
  { label: "1hr", units: 10, display: "10 units" },
  { label: "1.5hr", units: 15, display: "15 units" },
  { label: "2hr", units: 20, display: "20 units" },
  { label: "3hr", units: 30, display: "30 units" },
  { label: "4hr", units: 40, display: "40 units" },
];

/**
 * SixMinuteTimeInput Component
 * 
 * Specialized input for time tracking using 6-minute precision billing units.
 * Provides real-time conversion between 6-minute units and hours/minutes.
 * 
 * Business Context:
 * - 1 hour = 10 units (6 minutes each)
 * - Supports fractional units (e.g., 2.5 units = 15 minutes)
 * - Industry standard for professional time billing
 * 
 * Features:
 * - Real-time unit ↔ time conversion display
 * - Quick preset buttons for common time periods
 * - Visual feedback for billing calculations
 * - Accessible keyboard navigation
 */
export function SixMinuteTimeInput({
  value,
  onChange,
  label = "Time Spent",
  description,
  placeholder = "0",
  disabled = false,
  showConversion = true,
  showPreset = true,
  className = "",
}: SixMinuteTimeInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  // Convert 6-minute units to hours and minutes
  const convertUnitsToTime = (units: number) => {
    const totalMinutes = units * 6;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours === 0) {
      return `${minutes}min`;
    } else if (minutes === 0) {
      return `${hours}hr`;
    } else {
      return `${hours}hr ${minutes}min`;
    }
  };

  // Convert time input (hours/minutes) to 6-minute units
  const convertTimeToUnits = (timeStr: string): number => {
    // Handle formats like "1.5", "1:30", "90min", "1h 30m"
    timeStr = timeStr.toLowerCase().trim();
    
    // Direct decimal input (assume hours)
    if (/^\d*\.?\d+$/.test(timeStr)) {
      return parseFloat(timeStr) * 10; // Convert hours to units
    }
    
    // "1:30" format
    if (/^\d+:\d+$/.test(timeStr)) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return ((hours * 60) + minutes) / 6;
    }
    
    // "90min" format
    if (/^\d+min?$/.test(timeStr)) {
      const minutes = parseInt(timeStr);
      return minutes / 6;
    }
    
    // "1h 30m" or "1hr 30min" format
    const hourMatch = timeStr.match(/(\d+)h(?:r|our)?/);
    const minMatch = timeStr.match(/(\d+)m(?:in)?/);
    
    if (hourMatch || minMatch) {
      const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
      const minutes = minMatch ? parseInt(minMatch[1]) : 0;
      return ((hours * 60) + minutes) / 6;
    }
    
    return 0;
  };

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (inputVal: string) => {
    setInputValue(inputVal);
    
    // Try to parse as units first, then as time format
    let units = parseFloat(inputVal) || 0;
    
    // If input contains time indicators, convert to units
    if (/[hm:]/i.test(inputVal)) {
      units = convertTimeToUnits(inputVal);
    }
    
    onChange(Math.max(0, units));
  };

  const handlePresetClick = (units: number) => {
    setInputValue(units.toString());
    onChange(units);
  };

  const timeDisplay = convertUnitsToTime(value);
  const isValidInput = !isNaN(parseFloat(inputValue)) && parseFloat(inputValue) >= 0;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label and Description */}
      <div>
        <Label htmlFor="time-input" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {label}
        </Label>
        {description && (
          <p className="text-xs text-foreground opacity-60 mt-1">
            {description}
          </p>
        )}
      </div>

      {/* Main Input */}
      <div className="relative">
        <Timer className="absolute left-3 top-3 h-4 w-4 text-foreground opacity-60" />
        <Input
          id="time-input"
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`pl-10 ${
            !isValidInput ? 'border-red-500 focus:border-red-500' : ''
          }`}
        />
        
        {/* Unit Type Badge */}
        <div className="absolute right-2 top-2">
          <Badge variant="outline" className="text-xs">
            6-min units
          </Badge>
        </div>
      </div>

      {/* Time Conversion Display */}
      {showConversion && value > 0 && (
        <div className="flex items-center justify-between p-2 bg-muted rounded">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-foreground opacity-60" />
            <span className="text-sm font-medium">
              {value} units = {timeDisplay}
            </span>
          </div>
          <div className="text-xs text-foreground opacity-60">
            {(value * 6).toFixed(0)} minutes total
          </div>
        </div>
      )}

      {/* Quick Preset Buttons */}
      {showPreset && (
        <div>
          <Label className="text-xs text-foreground opacity-75 mb-2 block">
            Quick Presets:
          </Label>
          <div className="flex flex-wrap gap-1">
            {TIME_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.units)}
                disabled={disabled}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  value === preset.units
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-border'
                } ${
                  disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                title={preset.display}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Format Help */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Input formats:</strong> Direct units ("5"), hours ("1.5"), time ("1:30"), or descriptive ("90min", "1hr 30min")
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Utility function for external use
export const convertUnitsToHours = (units: number): number => {
  return units / 10;
};

export const convertHoursToUnits = (hours: number): number => {
  return hours * 10;
};

export const convertUnitsToMinutes = (units: number): number => {
  return units * 6;
};

export const convertMinutesToUnits = (minutes: number): number => {
  return minutes / 6;
};

// Validation helper
export const isValidTimeUnits = (value: any): boolean => {
  return typeof value === 'number' && !isNaN(value) && value >= 0;
};

// Formatting helper for display
export const formatTimeUnits = (units: number): string => {
  if (units === 0) return "0 units";
  if (units === 1) return "1 unit (6min)";
  
  const hours = Math.floor(units / 10);
  const remainingUnits = units % 10;
  
  if (hours > 0 && remainingUnits === 0) {
    return `${units} units (${hours}hr)`;
  } else {
    const totalMinutes = units * 6;
    return `${units} units (${Math.floor(totalMinutes / 60)}hr ${totalMinutes % 60}min)`;
  }
};

// Business calculation helper
export const calculateBillingAmount = (units: number, ratePerHour: number): number => {
  const hours = convertUnitsToHours(units);
  return hours * ratePerHour;
};

export default SixMinuteTimeInput;