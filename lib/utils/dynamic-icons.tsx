/**
 * Dynamic Icon Loading Utility
 * 
 * Reduces bundle size by loading lucide-react icons dynamically
 * instead of importing all icons upfront.
 */

import { LucideProps } from 'lucide-react';
import React, { lazy, ComponentType, SVGProps } from 'react';

type IconComponent = ComponentType<LucideProps>;

// Cache for loaded icons to avoid multiple imports
const iconCache = new Map<string, IconComponent>();

/**
 * Dynamically imports a lucide-react icon by name
 * @param iconName - The name of the icon (e.g., 'User', 'Settings')
 * @returns Promise resolving to the icon component
 */
export const loadIcon = async (iconName: string): Promise<IconComponent> => {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!;
  }

  try {
    const iconModule = await import('lucide-react');
    const IconComponent = iconModule[iconName as keyof typeof iconModule] as IconComponent;
    
    if (!IconComponent) {
      throw new Error(`Icon "${iconName}" not found`);
    }

    iconCache.set(iconName, IconComponent);
    return IconComponent;
  } catch (error) {
    console.warn(`Failed to load icon "${iconName}":`, error);
    // Return a fallback icon
    const { HelpCircle } = await import('lucide-react');
    return HelpCircle as IconComponent;
  }
};

/**
 * Lazy-loaded icon component that dynamically imports icons
 * Usage: <DynamicIcon name="User" className="w-4 h-4" />
 */
export const DynamicIcon: React.FC<{ name: string } & LucideProps> = ({ name, ...props }) => {
  const [IconComponent, setIconComponent] = React.useState<IconComponent | null>(null);
  
  React.useEffect(() => {
    loadIcon(name).then(setIconComponent);
  }, [name]);
  
  if (!IconComponent) {
    return <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />;
  }
  
  return <IconComponent {...props} />;
};

/**
 * Common icon names used throughout the application
 * Helps with type safety and prevents typos
 */
export const ICON_NAMES = {
  // Navigation
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Home: 'Home',
  Menu: 'Menu',
  
  // Actions
  Edit: 'Edit',
  Save: 'Save',
  Delete: 'Trash2',
  Plus: 'Plus',
  Minus: 'Minus',
  Search: 'Search',
  Filter: 'Filter',
  Download: 'Download',
  Upload: 'Upload',
  Copy: 'Copy',
  Share: 'Share',
  
  // Status
  Check: 'Check',
  CheckCircle: 'CheckCircle',
  X: 'X',
  AlertTriangle: 'AlertTriangle',
  Info: 'Info',
  Warning: 'AlertCircle',
  
  // Users & People
  User: 'User',
  Users: 'Users',
  UserCheck: 'UserCheck',
  UserPlus: 'UserPlus',
  
  // Business
  Building: 'Building2',
  Calendar: 'Calendar',
  Clock: 'Clock',
  DollarSign: 'DollarSign',
  Calculator: 'Calculator',
  FileText: 'FileText',
  
  // Communication
  Mail: 'Mail',
  Phone: 'Phone',
  MessageSquare: 'MessageSquare',
  
  // System
  Settings: 'Settings',
  Refresh: 'RefreshCw',
  Eye: 'Eye',
  EyeOff: 'EyeOff',
  MoreHorizontal: 'MoreHorizontal',
  MoreVertical: 'MoreVertical',
  
  // Data & Analytics
  TrendingUp: 'TrendingUp',
  TrendingDown: 'TrendingDown',
  BarChart: 'BarChart3',
  PieChart: 'PieChart',
  
} as const;

export type IconName = keyof typeof ICON_NAMES;

/**
 * Type-safe wrapper for DynamicIcon with predefined icon names
 */
export const TypedIcon = ({ name, ...props }: { name: IconName } & LucideProps) => {
  const iconName = ICON_NAMES[name];
  return <DynamicIcon name={iconName} {...props} />;
};