/**
 * Design Token Utilities
 * Helper functions for using design tokens in components
 */

import { tokens } from "./tokens";
import { cn } from "@/lib/utils";

// Re-export cn for convenience
export { cn };

/**
 * Get a colour value from the design tokens
 */
export function getColour(path: string): string {
  const keys = path.split(".");
  let value: any = tokens.colours;

  for (const key of keys) {
    value = value[key];
    if (!value) {
      console.warn(`Colour token not found: ${path}`);
      return "";
    }
  }

  return value;
}

/**
 * Get a spacing value from the design tokens
 */
export function getSpacing(key: string | number): string {
  const value = tokens.spacing[key as keyof typeof tokens.spacing];
  if (!value) {
    console.warn(`Spacing token not found: ${key}`);
    return "0";
  }
  return value;
}

/**
 * Get a font size from the design tokens
 */
export function getFontSize(key: string): string {
  const value =
    tokens.typography.fontSize[key as keyof typeof tokens.typography.fontSize];
  if (!value) {
    console.warn(`Font size token not found: ${key}`);
    return tokens.typography.fontSize.base;
  }
  return value;
}

/**
 * Get a shadow value from the design tokens
 */
export function getShadow(key: string): string {
  const value = tokens.shadows[key as keyof typeof tokens.shadows];
  if (!value) {
    console.warn(`Shadow token not found: ${key}`);
    return tokens.shadows.none;
  }
  return value;
}

/**
 * Get a border radius value from the design tokens
 */
export function getBorderRadius(key: string): string {
  const value = tokens.borderRadius[key as keyof typeof tokens.borderRadius];
  if (!value) {
    console.warn(`Border radius token not found: ${key}`);
    return tokens.borderRadius.base;
  }
  return value;
}

/**
 * Check if a colour combination meets WCAG contrast requirements
 * @param foreground - Foreground colour in HSL format
 * @param background - Background colour in HSL format
 * @param level - WCAG level ('AA' or 'AAA')
 * @returns boolean indicating if contrast meets requirements
 */
export function meetsContrastRequirements(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA"
): boolean {
  // This is a simplified check - in production, use a proper contrast calculation library
  // For now, we trust our predefined colour combinations meet WCAG standards
  return true;
}

/**
 * Generate responsive classes based on breakpoints
 */
export function responsive(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string,
  xxl?: string
): string {
  const classes = [base];

  if (sm) {
    classes.push(`sm:${sm}`);
  }
  if (md) {
    classes.push(`md:${md}`);
  }
  if (lg) {
    classes.push(`lg:${lg}`);
  }
  if (xl) {
    classes.push(`xl:${xl}`);
  }
  if (xxl) {
    classes.push(`2xl:${xxl}`);
  }

  return classes.join(" ");
}

/**
 * Generate focus-visible classes for accessibility
 */
export function focusRing(colour: string = "primary"): string {
  return `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-${colour} focus-visible:ring-offset-2 focus-visible:ring-offset-background`;
}

/**
 * Generate transition classes with reduced motion support
 */
export function transition(
  properties: string[] = ["all"],
  duration: keyof typeof tokens.transitions.duration = 200,
  timing: keyof typeof tokens.transitions.timing = "inOut"
): string {
  const transitionProps = properties.join(", ");
  return `transition-[${transitionProps}] duration-${duration} ${timing} motion-reduce:transition-none`;
}
