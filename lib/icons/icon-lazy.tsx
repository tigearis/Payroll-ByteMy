// lib/icons/icon-lazy.tsx
"use client";

import { LucideProps } from "lucide-react";
import React, { Suspense, lazy, ComponentType } from "react";

// ============================================================================
// CODE SPLITTING: LAZY LOAD ICON SETS
// ============================================================================

/**
 * Common icons that should be loaded immediately (used frequently)
 */
export { 
  User, 
  Users, 
  Settings, 
  Home, 
  Menu, 
  Search, 
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Info,
  Loader2
} from "lucide-react";

/**
 * Icon categories with their respective icon sets
 */
const ICON_SETS = {
  business: [
    'DollarSign', 'TrendingUp', 'TrendingDown', 'BarChart', 'LineChart', 
    'PieChart', 'Calendar', 'Clock', 'FileText', 'Briefcase', 'Building', 
    'CreditCard', 'Receipt', 'Calculator'
  ],
  action: [
    'Edit', 'Trash', 'Copy', 'Download', 'Upload', 'Share', 'Send', 
    'Save', 'RefreshCw', 'MoreHorizontal', 'MoreVertical', 'ExternalLink', 
    'Eye', 'EyeOff'
  ],
  file: [
    'File', 'FileSpreadsheet', 'FileImage', 'FileText', 'FileVideo', 
    'FileAudio', 'Folder', 'FolderOpen', 'Archive', 'Package'
  ],
  communication: [
    'Mail', 'MessageSquare', 'Phone', 'Video', 'Mic', 'MicOff', 'Bell', 'BellOff'
  ]
} as const;

// ============================================================================
// LAZY ICON WRAPPER COMPONENT
// ============================================================================

interface LazyIconProps extends LucideProps {
  name: string;
  category: "business" | "action" | "file" | "communication";
  fallback?: React.ComponentType<LucideProps>;
}

export function LazyIcon({ 
  name, 
  category, 
  fallback: Fallback,
  ...props 
}: LazyIconProps) {
  const [IconComponent, setIconComponent] = React.useState<ComponentType<LucideProps> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Default fallback icon
  const DefaultFallback = () => (
    <div 
      className={`inline-block bg-gray-200 rounded ${props.className || "w-4 h-4"}`}
      style={{ width: props.size || 16, height: props.size || 16 }}
    />
  );

  const IconFallback = Fallback || DefaultFallback;

  React.useEffect(() => {
    let mounted = true;

    const loadIcon = async () => {
      try {
        // Validate icon exists in category
        const iconSet = ICON_SETS[category];
        if (!iconSet.includes(name as string)) {
          if (mounted) setIsLoading(false);
          return;
        }

        const icons = await import("lucide-react");
        const icon = (icons as any)[name];
        
        if (mounted && icon) {
          setIconComponent(() => icon);
        }
      } catch (error) {
        console.warn(`Failed to load icon: ${name}`, error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadIcon();

    return () => {
      mounted = false;
    };
  }, [name, category]);

  if (isLoading) {
    return <IconFallback />;
  }

  if (!IconComponent) {
    return <IconFallback />;
  }

  return <IconComponent {...props} />;
}

// ============================================================================
// CONVENIENCE COMPONENTS FOR SPECIFIC ICON CATEGORIES
// ============================================================================

export function BusinessIcon({ name, ...props }: Omit<LazyIconProps, "category">) {
  return <LazyIcon name={name} category="business" {...props} />;
}

export function ActionIcon({ name, ...props }: Omit<LazyIconProps, "category">) {
  return <LazyIcon name={name} category="action" {...props} />;
}

export function FileIcon({ name, ...props }: Omit<LazyIconProps, "category">) {
  return <LazyIcon name={name} category="file" {...props} />;
}

export function CommunicationIcon({ name, ...props }: Omit<LazyIconProps, "category">) {
  return <LazyIcon name={name} category="communication" {...props} />;
}