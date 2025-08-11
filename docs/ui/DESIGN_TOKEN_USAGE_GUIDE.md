# 🎨 Design Token Usage Guide
*Comprehensive guide for consistent UI development using semantic design tokens*

## Overview

This guide ensures consistent visual design across the Payroll-ByteMy application by using semantic design tokens instead of hardcoded color values.

## 🚫 What NOT to Use (Hardcoded Colors)

### ❌ Avoid These Patterns:
```tsx
// ❌ DON'T: Hardcoded color values
className="text-blue-600"
className="bg-gray-50"
className="text-red-500"
className="border-green-200"
className="bg-purple-100"
```

## ✅ What TO Use (Semantic Design Tokens)

### Primary Colors
```tsx
// ✅ DO: Use semantic color tokens
className="text-primary"              // Primary brand color
className="text-primary-foreground"   // Text on primary background
className="bg-primary"                // Primary background
className="bg-primary/5"              // Primary with 5% opacity
className="bg-primary/10"             // Primary with 10% opacity
className="border-primary"            // Primary border
```

### Text Colors
```tsx
// ✅ Text hierarchy
className="text-foreground"           // Primary text color
className="text-muted-foreground"     // Secondary/muted text
className="text-destructive"          // Error/danger text
className="text-accent"               // Accent text color
```

### Background Colors
```tsx
// ✅ Background variants
className="bg-background"             // Main background
className="bg-muted"                  // Muted background
className="bg-muted/50"               // Muted with 50% opacity
className="bg-accent"                 // Accent background
className="bg-destructive"            // Error/danger background
```

### Border Colors
```tsx
// ✅ Border variants
className="border-border"             // Default border
className="border-input"              // Input field borders
className="border-destructive"        // Error borders
className="border-muted"              // Subtle borders
```

### Component States
```tsx
// ✅ Interactive states
className="hover:bg-accent"           // Hover background
className="hover:text-accent-foreground" // Hover text
className="focus-visible:ring-ring"   // Focus ring
className="disabled:opacity-50"       // Disabled state
```

## 📋 Common Pattern Replacements

### Color Migration Table

| ❌ Old (Hardcoded) | ✅ New (Semantic) | Use Case |
|-------------------|------------------|----------|
| `text-gray-500` | `text-muted-foreground` | Secondary text |
| `text-gray-600` | `text-muted-foreground` | Descriptive text |
| `text-blue-600` | `text-primary` | Primary brand text |
| `bg-blue-50` | `bg-primary/5` | Light primary background |
| `bg-gray-50` | `bg-muted/50` | Subtle background |
| `bg-green-100` | `bg-green-500/10` | Success state (if needed) |
| `bg-red-100` | `bg-destructive/10` | Error state background |
| `border-gray-200` | `border-border` | Default borders |
| `hover:bg-gray-100` | `hover:bg-muted/50` | Hover states |

### Status Colors (When Semantic Tokens Don't Apply)

For specific status indicators that need explicit colors:
```tsx
// ✅ Acceptable for specific status meanings
className="text-green-600"            // Success/completed status
className="text-red-600"              // Error/failed status  
className="text-amber-600"            // Warning/pending status
className="bg-green-500/10"           // Success background
className="bg-red-500/10"             // Error background
```

## 🎯 Component Examples

### Before & After Examples

#### Card Component
```tsx
// ❌ Before (hardcoded colors)
<div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
  <h3 className="text-gray-900 font-medium">Title</h3>
  <p className="text-gray-600 text-sm">Description text</p>
</div>

// ✅ After (semantic tokens)
<div className="bg-muted/50 border border-border p-4 rounded-lg">
  <h3 className="text-foreground font-medium">Title</h3>
  <p className="text-muted-foreground text-sm">Description text</p>
</div>
```

#### Button States
```tsx
// ❌ Before
<button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded">
  Submit
</button>

// ✅ After (use design system Button component)
<Button>Submit</Button>

// Or if custom styling needed:
<button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded">
  Submit
</button>
```

#### Form Fields
```tsx
// ❌ Before
<input className="border border-gray-300 bg-white text-gray-900 focus:border-blue-500" />

// ✅ After
<Input /> // Use design system Input component

// Or if custom styling needed:
<input className="border border-input bg-background text-foreground focus-visible:ring-ring" />
```

### Summary Cards Pattern
```tsx
// ✅ Correct pattern for metric cards
<div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
  <div className="flex items-center gap-3 mb-3">
    <div className="p-2 rounded-full bg-primary">
      <Icon className="h-4 w-4 text-primary-foreground" />
    </div>
    <div>
      <h3 className="font-medium text-foreground">Metric Title</h3>
      <p className="text-sm text-muted-foreground">Description</p>
    </div>
  </div>
</div>
```

### Loading States
```tsx
// ✅ Consistent loading patterns
<div className="text-center py-8 text-muted-foreground">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
  <p className="text-muted-foreground">Loading...</p>
</div>
```

### Error/Empty States  
```tsx
// ✅ Consistent empty state patterns
<div className="text-center py-8 text-muted-foreground">
  <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
  <p>No data available</p>
  <p className="text-sm">Additional context here</p>
</div>
```

## 🛠️ Implementation Guidelines

### 1. Component Development
- Always use semantic tokens first
- Fall back to specific colors only for status meanings
- Test in both light and dark themes (if applicable)

### 2. Code Review Checklist
- [ ] No hardcoded color values (blue-600, gray-500, etc.)
- [ ] Semantic tokens used consistently
- [ ] Hover and focus states use design tokens
- [ ] Text hierarchy follows foreground/muted-foreground pattern

### 3. Migration Strategy
1. **Identify**: Use grep to find hardcoded colors: `grep -r "text-blue\|bg-gray\|text-red" .`
2. **Replace**: Systematically replace with semantic equivalents
3. **Test**: Verify visual consistency across components
4. **Document**: Update component documentation

## 📚 Design System Components

### Use These Instead of Custom Styling
- `<Button>` - All button variants
- `<Input>` - Form inputs
- `<Card>` - Content containers  
- `<Badge>` - Status indicators
- `<Dialog>` - Modal overlays
- `<Table>` - Data tables

### Design System Benefits
- ✅ Automatic semantic color usage
- ✅ Consistent spacing and typography
- ✅ Accessibility built-in
- ✅ Theme support ready
- ✅ Reduced maintenance overhead

## 🎨 Tailwind CSS Configuration

The application uses these CSS custom properties for semantic tokens:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
  /* ... additional tokens */
}
```

## 🔍 Quick Reference

| Token | Usage | Example |
|-------|--------|---------|
| `text-foreground` | Primary text | Headings, labels |
| `text-muted-foreground` | Secondary text | Descriptions, captions |
| `bg-primary` | Brand elements | CTA buttons, highlights |
| `bg-muted` | Subtle backgrounds | Form sections, cards |
| `border-border` | Default borders | Dividers, containers |
| `hover:bg-accent` | Interactive hover | Clickable elements |

---

**Remember**: Consistent use of semantic design tokens ensures the application maintains visual coherence, supports future theming, and reduces technical debt from hardcoded values.

For questions about design token usage, refer to the design system documentation or create an issue for clarification.