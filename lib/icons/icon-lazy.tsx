// lib/icons/icon-lazy.tsx
"use client";

import { LucideProps } from "lucide-react";
import { Suspense, lazy } from "react";

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
 * Business/Dashboard icons (lazy loaded)
 */
const LazyBusinessIcons = lazy(async () => {
  const icons = await import("lucide-react");
  
  return {
    DollarSign: icons.DollarSign,
    TrendingUp: icons.TrendingUp,
    TrendingDown: icons.TrendingDown,
    BarChart: icons.BarChart,
    LineChart: icons.LineChart,
    PieChart: icons.PieChart,
    Calendar: icons.Calendar,
    Clock: icons.Clock,
    FileText: icons.FileText,
    Briefcase: icons.Briefcase,
    Building: icons.Building,
    CreditCard: icons.CreditCard,
    Receipt: icons.Receipt,
    Calculator: icons.Calculator,
  };
});

/**
 * Action icons (lazy loaded)
 */
const LazyActionIcons = lazy(async () => {
  const icons = await import("lucide-react");
  
  return {
    Edit: icons.Edit,
    Trash: icons.Trash,
    Copy: icons.Copy,
    Download: icons.Download,
    Upload: icons.Upload,
    Share: icons.Share,
    Send: icons.Send,
    Save: icons.Save,
    RefreshCw: icons.RefreshCw,
    MoreHorizontal: icons.MoreHorizontal,
    MoreVertical: icons.MoreVertical,
    ExternalLink: icons.ExternalLink,
    Eye: icons.Eye,
    EyeOff: icons.EyeOff,
  };
});

/**
 * File & Document icons (lazy loaded)
 */
const LazyFileIcons = lazy(async () => {
  const icons = await import("lucide-react");
  
  return {
    File: icons.File,
    FileSpreadsheet: icons.FileSpreadsheet,
    FileImage: icons.FileImage,
    FilePdf: icons.FilePdf,
    FileVideo: icons.FileVideo,
    FileAudio: icons.FileAudio,
    Folder: icons.Folder,
    FolderOpen: icons.FolderOpen,
    Archive: icons.Archive,
    Package: icons.Package,
  };
});

/**
 * Communication icons (lazy loaded)
 */
const LazyCommunicationIcons = lazy(async () => {
  const icons = await import("lucide-react");
  
  return {
    Mail: icons.Mail,
    MessageSquare: icons.MessageSquare,
    Phone: icons.Phone,
    Video: icons.Video,
    Mic: icons.Mic,
    MicOff: icons.MicOff,
    Bell: icons.Bell,
    BellOff: icons.BellOff,
  };
});

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
  // Default fallback icon
  const DefaultFallback = () => (
    <div 
      className={`inline-block bg-gray-200 rounded ${props.className || "w-4 h-4"}`}
      style={{ width: props.size || 16, height: props.size || 16 }}
    />
  );

  const IconFallback = Fallback || DefaultFallback;

  const renderIcon = () => {
    switch (category) {
      case "business":
        return (
          <Suspense fallback={<IconFallback />}>
            <LazyBusinessIcons>
              {(icons) => {
                const IconComponent = icons[name as keyof typeof icons];
                return IconComponent ? <IconComponent {...props} /> : <IconFallback />;
              }}
            </LazyBusinessIcons>
          </Suspense>
        );
        
      case "action":
        return (
          <Suspense fallback={<IconFallback />}>
            <LazyActionIcons>
              {(icons) => {
                const IconComponent = icons[name as keyof typeof icons];
                return IconComponent ? <IconComponent {...props} /> : <IconFallback />;
              }}
            </LazyActionIcons>
          </Suspense>
        );
        
      case "file":
        return (
          <Suspense fallback={<IconFallback />}>
            <LazyFileIcons>
              {(icons) => {
                const IconComponent = icons[name as keyof typeof icons];
                return IconComponent ? <IconComponent {...props} /> : <IconFallback />;
              }}
            </LazyFileIcons>
          </Suspense>
        );
        
      case "communication":
        return (
          <Suspense fallback={<IconFallback />}>
            <LazyCommunicationIcons>
              {(icons) => {
                const IconComponent = icons[name as keyof typeof icons];
                return IconComponent ? <IconComponent {...props} /> : <IconFallback />;
              }}
            </LazyCommunicationIcons>
          </Suspense>
        );
        
      default:
        return <IconFallback />;
    }
  };

  return renderIcon();
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