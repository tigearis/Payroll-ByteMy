"use client";

import { Menu, X } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { tokens } from "@/lib/design-tokens";
import { useLayoutPreferences } from "@/lib/preferences/layout-preferences";

interface ResponsiveLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  header: ReactNode;
}

/**
 * Responsive Layout Component
 *
 * Handles different layout patterns for:
 * - Desktop: Traditional sidebar + main content
 * - Tablet: Collapsible sidebar + main content
 * - Mobile: Mobile header + slide-out navigation + full-width content
 */
export function ResponsiveLayout({
  children,
  sidebar,
  header,
}: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { sidebarCollapsed } = useLayoutPreferences();

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < parseInt(tokens.breakpoints.md));
      setIsTablet(
        width >= parseInt(tokens.breakpoints.md) &&
          width < parseInt(tokens.breakpoints.lg)
      );
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white dark:bg-neutral-950 px-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="font-semibold text-lg">Navigation</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-auto">{sidebar}</div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Mobile Header Content */}
          <div className="flex-1 mx-4">{header}</div>
        </header>

        {/* Mobile Content */}
        <main className="p-4">{children}</main>
      </div>
    );
  }

  // Tablet Layout
  if (isTablet) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Header */}
        {header}

        <div className="flex">
          {/* Collapsible Sidebar */}
          <aside className="transition-all duration-200">{sidebar}</aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  // Desktop Layout (default)
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      {header}

      <div className="flex">
        {/* Sidebar */}
        <aside className="transition-all duration-200">{sidebar}</aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

/**
 * Mobile-First Data Card Component
 * Alternative to tables for mobile devices
 */
interface DataCardProps {
  children: ReactNode;
  className?: string;
}

export function DataCard({ children, className }: DataCardProps) {
  return (
    <div
      className={`bg-white dark:bg-neutral-950 rounded-lg border p-4 space-y-3 ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={`space-y-2 text-sm text-muted-foreground ${className}`}>
      {children}
    </div>
  );
}

interface CardActionsProps {
  children: ReactNode;
  className?: string;
}

export function CardActions({ children, className }: CardActionsProps) {
  return (
    <div
      className={`flex items-center justify-end gap-2 pt-2 border-t ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Mobile-optimized Card View for data display
 * Alternative to complex tables on mobile devices
 */
interface CardViewProps<T> {
  items: T[];
  renderCard: (item: T, index: number) => ReactNode;
  loading?: boolean;
  empty?: ReactNode;
  className?: string;
}

export function CardView<T>({
  items,
  renderCard,
  loading,
  empty,
  className,
}: CardViewProps<T>) {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-neutral-950 rounded-lg border p-4"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
              <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
              <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        {empty || (
          <div className="text-neutral-500 dark:text-neutral-400">
            No items to display
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <div key={(item as any)?.id ?? index}>{renderCard(item, index)}</div>
      ))}
    </div>
  );
}
