/**
 * Theme Configuration
 * Maps design tokens to CSS variables for light and dark modes
 * Ensures WCAG AA/AAA compliance for all colour combinations
 */

import { tokens } from './tokens';

export const lightTheme = {
  // Background colours
  background: {
    primary: tokens.colours.neutral[0],
    secondary: tokens.colours.neutral[50],
    tertiary: tokens.colours.neutral[100],
    inverse: tokens.colours.neutral[900],
  },
  
  // Foreground colours
  foreground: {
    primary: tokens.colours.neutral[900],
    secondary: tokens.colours.neutral[700],
    tertiary: tokens.colours.neutral[600],
    muted: tokens.colours.neutral[500],
    inverse: tokens.colours.neutral[0],
  },
  
  // Border colours
  border: {
    default: tokens.colours.neutral[200],
    muted: tokens.colours.neutral[100],
    strong: tokens.colours.neutral[300],
  },
  
  // Brand colours
  brand: {
    primary: tokens.colours.primary[500],
    primaryHover: tokens.colours.primary[600],
    primaryForeground: tokens.colours.neutral[0],
    secondary: tokens.colours.secondary[500],
    secondaryHover: tokens.colours.secondary[600],
    secondaryForeground: tokens.colours.neutral[0],
  },
  
  // Semantic colours
  semantic: {
    success: tokens.colours.success[600],
    successBackground: tokens.colours.success[50],
    successForeground: tokens.colours.success[700],
    
    warning: tokens.colours.warning[600],
    warningBackground: tokens.colours.warning[50],
    warningForeground: tokens.colours.warning[700],
    
    error: tokens.colours.error[600],
    errorBackground: tokens.colours.error[50],
    errorForeground: tokens.colours.error[700],
    
    info: tokens.colours.info[600],
    infoBackground: tokens.colours.info[50],
    infoForeground: tokens.colours.info[700],
  },
  
  // Interactive states
  interactive: {
    hover: 'rgba(0, 0, 0, 0.05)',
    active: 'rgba(0, 0, 0, 0.1)',
    focus: tokens.colours.primary[500],
    disabled: tokens.colours.neutral[300],
  },
};

export const darkTheme = {
  // Background colours
  background: {
    primary: tokens.colours.neutral[950],
    secondary: tokens.colours.neutral[900],
    tertiary: tokens.colours.neutral[800],
    inverse: tokens.colours.neutral[50],
  },
  
  // Foreground colours
  foreground: {
    primary: tokens.colours.neutral[50],
    secondary: tokens.colours.neutral[200],
    tertiary: tokens.colours.neutral[300],
    muted: tokens.colours.neutral[400],
    inverse: tokens.colours.neutral[950],
  },
  
  // Border colours
  border: {
    default: tokens.colours.neutral[800],
    muted: tokens.colours.neutral[900],
    strong: tokens.colours.neutral[700],
  },
  
  // Brand colours
  brand: {
    primary: tokens.colours.primary[400],
    primaryHover: tokens.colours.primary[300],
    primaryForeground: tokens.colours.neutral[950],
    secondary: tokens.colours.secondary[400],
    secondaryHover: tokens.colours.secondary[300],
    secondaryForeground: tokens.colours.neutral[950],
  },
  
  // Semantic colours
  semantic: {
    success: tokens.colours.success[400],
    successBackground: tokens.colours.success[900],
    successForeground: tokens.colours.success[300],
    
    warning: tokens.colours.warning[400],
    warningBackground: tokens.colours.warning[900],
    warningForeground: tokens.colours.warning[300],
    
    error: tokens.colours.error[400],
    errorBackground: tokens.colours.error[900],
    errorForeground: tokens.colours.error[300],
    
    info: tokens.colours.info[400],
    infoBackground: tokens.colours.info[900],
    infoForeground: tokens.colours.info[300],
  },
  
  // Interactive states
  interactive: {
    hover: 'rgba(255, 255, 255, 0.05)',
    active: 'rgba(255, 255, 255, 0.1)',
    focus: tokens.colours.primary[400],
    disabled: tokens.colours.neutral[700],
  },
};

// CSS variable mapping
export const cssVariables = {
  light: {
    '--background': lightTheme.background.primary,
    '--background-secondary': lightTheme.background.secondary,
    '--background-tertiary': lightTheme.background.tertiary,
    '--background-inverse': lightTheme.background.inverse,
    
    '--foreground': lightTheme.foreground.primary,
    '--foreground-secondary': lightTheme.foreground.secondary,
    '--foreground-tertiary': lightTheme.foreground.tertiary,
    '--foreground-muted': lightTheme.foreground.muted,
    '--foreground-inverse': lightTheme.foreground.inverse,
    
    '--border': lightTheme.border.default,
    '--border-muted': lightTheme.border.muted,
    '--border-strong': lightTheme.border.strong,
    
    '--primary': lightTheme.brand.primary,
    '--primary-hover': lightTheme.brand.primaryHover,
    '--primary-foreground': lightTheme.brand.primaryForeground,
    
    '--secondary': lightTheme.brand.secondary,
    '--secondary-hover': lightTheme.brand.secondaryHover,
    '--secondary-foreground': lightTheme.brand.secondaryForeground,
    
    '--success': lightTheme.semantic.success,
    '--success-background': lightTheme.semantic.successBackground,
    '--success-foreground': lightTheme.semantic.successForeground,
    
    '--warning': lightTheme.semantic.warning,
    '--warning-background': lightTheme.semantic.warningBackground,
    '--warning-foreground': lightTheme.semantic.warningForeground,
    
    '--error': lightTheme.semantic.error,
    '--error-background': lightTheme.semantic.errorBackground,
    '--error-foreground': lightTheme.semantic.errorForeground,
    
    '--info': lightTheme.semantic.info,
    '--info-background': lightTheme.semantic.infoBackground,
    '--info-foreground': lightTheme.semantic.infoForeground,
    
    '--hover': lightTheme.interactive.hover,
    '--active': lightTheme.interactive.active,
    '--focus': lightTheme.interactive.focus,
    '--disabled': lightTheme.interactive.disabled,
  },
  
  dark: {
    '--background': darkTheme.background.primary,
    '--background-secondary': darkTheme.background.secondary,
    '--background-tertiary': darkTheme.background.tertiary,
    '--background-inverse': darkTheme.background.inverse,
    
    '--foreground': darkTheme.foreground.primary,
    '--foreground-secondary': darkTheme.foreground.secondary,
    '--foreground-tertiary': darkTheme.foreground.tertiary,
    '--foreground-muted': darkTheme.foreground.muted,
    '--foreground-inverse': darkTheme.foreground.inverse,
    
    '--border': darkTheme.border.default,
    '--border-muted': darkTheme.border.muted,
    '--border-strong': darkTheme.border.strong,
    
    '--primary': darkTheme.brand.primary,
    '--primary-hover': darkTheme.brand.primaryHover,
    '--primary-foreground': darkTheme.brand.primaryForeground,
    
    '--secondary': darkTheme.brand.secondary,
    '--secondary-hover': darkTheme.brand.secondaryHover,
    '--secondary-foreground': darkTheme.brand.secondaryForeground,
    
    '--success': darkTheme.semantic.success,
    '--success-background': darkTheme.semantic.successBackground,
    '--success-foreground': darkTheme.semantic.successForeground,
    
    '--warning': darkTheme.semantic.warning,
    '--warning-background': darkTheme.semantic.warningBackground,
    '--warning-foreground': darkTheme.semantic.warningForeground,
    
    '--error': darkTheme.semantic.error,
    '--error-background': darkTheme.semantic.errorBackground,
    '--error-foreground': darkTheme.semantic.errorForeground,
    
    '--info': darkTheme.semantic.info,
    '--info-background': darkTheme.semantic.infoBackground,
    '--info-foreground': darkTheme.semantic.infoForeground,
    
    '--hover': darkTheme.interactive.hover,
    '--active': darkTheme.interactive.active,
    '--focus': darkTheme.interactive.focus,
    '--disabled': darkTheme.interactive.disabled,
  },
};