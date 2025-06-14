/**
 * Accessibility Helpers and Components
 * Tools for implementing WCAG 2.1 AA compliant interfaces
 */
import React from "react";
import { cn } from "@/lib/design-tokens";

// ==============================================
// VisuallyHidden - Hide content visually but keep it accessible to screen readers
// ==============================================
export interface VisuallyHiddenProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  VisuallyHiddenProps
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0",
        "clip-[rect(0,0,0,0)]",
        className
      )}
      {...props}
    />
  );
});
VisuallyHidden.displayName = "VisuallyHidden";

// ==============================================
// SkipLink - Skip to main content link (appears on tab focus)
// ==============================================
export interface SkipLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  destinationId?: string;
}

export const SkipLink = React.forwardRef<HTMLAnchorElement, SkipLinkProps>(
  (
    {
      className,
      destinationId = "main-content",
      children = "Skip to main content",
      ...props
    },
    ref
  ) => {
    return (
      <a
        ref={ref}
        href={`#${destinationId}`}
        className={cn(
          "fixed top-0 left-0 z-50 p-3 bg-primary-600 text-white transform -translate-y-full focus:translate-y-0 transition",
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);
SkipLink.displayName = "SkipLink";

// ==============================================
// LiveRegion - For dynamic content announcements
// ==============================================
export interface LiveRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  "aria-live"?: "polite" | "assertive" | "off";
  "aria-atomic"?: boolean;
  "aria-relevant"?:
    | "additions"
    | "removals"
    | "text"
    | "all"
    | "additions text"
    | "additions removals"
    | "removals text"
    | "text additions"
    | "text removals"
    | "removals additions";
}

export const LiveRegion = React.forwardRef<HTMLDivElement, LiveRegionProps>(
  (
    {
      className,
      "aria-live": ariaLive = "polite",
      "aria-atomic": ariaAtomic = true,
      "aria-relevant": ariaRelevant = "additions text",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        aria-live={ariaLive}
        aria-atomic={ariaAtomic ? "true" : "false"}
        aria-relevant={ariaRelevant}
        className={cn("sr-only", className)}
        {...props}
      />
    );
  }
);
LiveRegion.displayName = "LiveRegion";

// ==============================================
// FocusTrap - Trap focus within a component (modal, dropdown)
// ==============================================
export interface FocusTrapProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

export const FocusTrap = React.forwardRef<HTMLDivElement, FocusTrapProps>(
  ({ children, active = true, ...props }, ref) => {
    const startRef = React.useRef<HTMLDivElement>(null);
    const endRef = React.useRef<HTMLDivElement>(null);

    // Handle focus trap
    React.useEffect(() => {
      if (!active) return;

      const handleFocusTrap = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        const container = ref as React.RefObject<HTMLDivElement>;
        if (!container.current) return;

        // Get all focusable elements
        const focusableEls = container.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusable = focusableEls[0] as HTMLElement;
        const lastFocusable = focusableEls[
          focusableEls.length - 1
        ] as HTMLElement;

        // If shift+tab and focused on first item, move to last focusable
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
        // If tab and focused on last item, move to first focusable
        else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      };

      document.addEventListener("keydown", handleFocusTrap);
      return () => document.removeEventListener("keydown", handleFocusTrap);
    }, [active, ref]);

    return (
      <div ref={ref} {...props}>
        {/* Sentinel nodes for focus trapping */}
        {active && (
          <div
            ref={startRef}
            tabIndex={0}
            onFocus={() => {
              const container = ref as React.RefObject<HTMLDivElement>;
              if (!container.current) return;
              const focusableEls = container.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              );
              const lastFocusable = focusableEls[
                focusableEls.length - 1
              ] as HTMLElement;
              lastFocusable?.focus();
            }}
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: 0,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          />
        )}

        {children}

        {active && (
          <div
            ref={endRef}
            tabIndex={0}
            onFocus={() => {
              const container = ref as React.RefObject<HTMLDivElement>;
              if (!container.current) return;
              const focusableEls = container.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              );
              const firstFocusable = focusableEls[0] as HTMLElement;
              firstFocusable?.focus();
            }}
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: 0,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          />
        )}
      </div>
    );
  }
);
FocusTrap.displayName = "FocusTrap";

// ==============================================
// Utility functions
// ==============================================

/**
 * Announces text to screen readers
 * @param message The message to announce
 * @param priority Whether to announce immediately (assertive) or wait (polite)
 */
export function announceToScreenReader(
  message: string,
  priority: "assertive" | "polite" = "polite"
) {
  if (typeof document === "undefined") return;

  const el = document.createElement("div");
  el.setAttribute("aria-live", priority);
  el.setAttribute("aria-atomic", "true");
  el.classList.add("sr-only");
  el.textContent = message;

  document.body.appendChild(el);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(el);
  }, 1000);
}

/**
 * Check if element meets color contrast requirements (WCAG 2.1 AA)
 * @param foreground The foreground color (hex)
 * @param background The background color (hex)
 * @returns Whether the contrast meets WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text)
 */
export function checkContrast(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Calculate relative luminance
  const luminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const rgb1 = hexToRgb(foreground);
  const rgb2 = hexToRgb(background);

  if (!rgb1 || !rgb2) return false;

  const l1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = luminance(rgb2.r, rgb2.g, rgb2.b);

  const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  // WCAG 2.1 AA requires 4.5:1 for normal text, 3:1 for large text
  return isLargeText ? contrast >= 3 : contrast >= 4.5;
}
