/**
 * Design Tokens System
 * Centralised design tokens for consistent UI across the application
 * All values follow WCAG AA/AAA compliance standards
 */

export const tokens = {
  // Colour Palette
  colours: {
    // Primary colours
    primary: {
      50: "hsl(217, 91%, 97%)",
      100: "hsl(217, 91%, 94%)",
      200: "hsl(217, 91%, 88%)",
      300: "hsl(217, 91%, 79%)",
      400: "hsl(217, 91%, 68%)",
      500: "hsl(217, 91%, 60%)", // Main primary
      600: "hsl(217, 91%, 52%)",
      700: "hsl(217, 91%, 44%)",
      800: "hsl(217, 91%, 36%)",
      900: "hsl(217, 91%, 28%)",
      950: "hsl(217, 91%, 20%)",
    },

    // Secondary colours
    secondary: {
      50: "hsl(210, 40%, 98%)",
      100: "hsl(210, 40%, 96%)",
      200: "hsl(210, 40%, 92%)",
      300: "hsl(210, 40%, 86%)",
      400: "hsl(210, 40%, 78%)",
      500: "hsl(210, 40%, 70%)",
      600: "hsl(210, 40%, 60%)",
      700: "hsl(210, 40%, 50%)",
      800: "hsl(210, 40%, 40%)",
      900: "hsl(210, 40%, 30%)",
      950: "hsl(210, 40%, 20%)",
    },

    // Neutral colours
    neutral: {
      0: "hsl(0, 0%, 100%)",
      50: "hsl(210, 20%, 98%)",
      100: "hsl(210, 20%, 96%)",
      200: "hsl(210, 20%, 92%)",
      300: "hsl(210, 20%, 86%)",
      400: "hsl(210, 20%, 70%)",
      500: "hsl(210, 20%, 50%)",
      600: "hsl(210, 20%, 40%)",
      700: "hsl(210, 20%, 30%)",
      800: "hsl(210, 20%, 20%)",
      900: "hsl(210, 20%, 10%)",
      950: "hsl(210, 20%, 5%)",
    },

    // Semantic colours
    success: {
      50: "hsl(142, 76%, 97%)",
      100: "hsl(142, 76%, 94%)",
      200: "hsl(142, 76%, 88%)",
      300: "hsl(142, 76%, 79%)",
      400: "hsl(142, 76%, 68%)",
      500: "hsl(142, 76%, 56%)",
      600: "hsl(142, 76%, 44%)",
      700: "hsl(142, 76%, 36%)",
      800: "hsl(142, 76%, 28%)",
      900: "hsl(142, 76%, 20%)",
    },

    warning: {
      50: "hsl(45, 100%, 97%)",
      100: "hsl(45, 100%, 94%)",
      200: "hsl(45, 100%, 88%)",
      300: "hsl(45, 100%, 79%)",
      400: "hsl(45, 100%, 68%)",
      500: "hsl(45, 100%, 56%)",
      600: "hsl(45, 100%, 44%)",
      700: "hsl(45, 100%, 36%)",
      800: "hsl(45, 100%, 28%)",
      900: "hsl(45, 100%, 20%)",
    },

    error: {
      50: "hsl(0, 84%, 97%)",
      100: "hsl(0, 84%, 94%)",
      200: "hsl(0, 84%, 88%)",
      300: "hsl(0, 84%, 79%)",
      400: "hsl(0, 84%, 68%)",
      500: "hsl(0, 84%, 60%)",
      600: "hsl(0, 84%, 52%)",
      700: "hsl(0, 84%, 44%)",
      800: "hsl(0, 84%, 36%)",
      900: "hsl(0, 84%, 28%)",
    },

    info: {
      50: "hsl(199, 89%, 97%)",
      100: "hsl(199, 89%, 94%)",
      200: "hsl(199, 89%, 88%)",
      300: "hsl(199, 89%, 79%)",
      400: "hsl(199, 89%, 68%)",
      500: "hsl(199, 89%, 56%)",
      600: "hsl(199, 89%, 44%)",
      700: "hsl(199, 89%, 36%)",
      800: "hsl(199, 89%, 28%)",
      900: "hsl(199, 89%, 20%)",
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: [
        "Inter",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "sans-serif",
      ],
      mono: [
        "JetBrains Mono",
        "Consolas",
        "Monaco",
        "Courier New",
        "monospace",
      ],
    },

    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
    },

    fontWeight: {
      thin: "100",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },

    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },

    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  // Spacing
  spacing: {
    0: "0",
    px: "1px",
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    3.5: "0.875rem", // 14px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    7: "1.75rem", // 28px
    8: "2rem", // 32px
    9: "2.25rem", // 36px
    10: "2.5rem", // 40px
    11: "2.75rem", // 44px
    12: "3rem", // 48px
    14: "3.5rem", // 56px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    28: "7rem", // 112px
    32: "8rem", // 128px
    36: "9rem", // 144px
    40: "10rem", // 160px
    44: "11rem", // 176px
    48: "12rem", // 192px
    52: "13rem", // 208px
    56: "14rem", // 224px
    60: "15rem", // 240px
    64: "16rem", // 256px
    72: "18rem", // 288px
    80: "20rem", // 320px
    96: "24rem", // 384px
  },

  // Border radius
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    base: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  },

  // Shadows
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  },

  // Transitions
  transitions: {
    duration: {
      75: "75ms",
      100: "100ms",
      150: "150ms",
      200: "200ms",
      300: "300ms",
      500: "500ms",
      700: "700ms",
      1000: "1000ms",
    },

    timing: {
      linear: "linear",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  // Z-index
  zIndex: {
    0: "0",
    10: "10",
    20: "20",
    30: "30",
    40: "40",
    50: "50",
    dropdown: "1000",
    sticky: "1020",
    fixed: "1030",
    modalBackdrop: "1040",
    modal: "1050",
    popover: "1060",
    tooltip: "1070",
  },

  // Breakpoints
  breakpoints: {
    xs: "475px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// Type exports
export type Colours = typeof tokens.colours;
export type Typography = typeof tokens.typography;
export type Spacing = typeof tokens.spacing;
export type BorderRadius = typeof tokens.borderRadius;
export type Shadows = typeof tokens.shadows;
export type Transitions = typeof tokens.transitions;
export type ZIndex = typeof tokens.zIndex;
export type Breakpoints = typeof tokens.breakpoints;
