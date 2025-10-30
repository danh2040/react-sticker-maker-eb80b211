# Styling Guide

This guide explains how styling works in the React components and how to properly set up and customize styles.

## Table of Contents
1. [Quick Setup](#quick-setup)
2. [Architecture Overview](#architecture-overview)
3. [Global Styles](#global-styles)
4. [Component Styles](#component-styles)
5. [Theme System](#theme-system)
6. [Customization](#customization)
7. [Troubleshooting](#troubleshooting)

## Quick Setup

### Minimum Required Setup

```javascript
// In your main entry file (index.js or App.js)
import './react-components/styles.scss';
import { Badge, Card } from './react-components';

function App() {
  return (
    <div>
      <Badge variant="featured">Hello</Badge>
    </div>
  );
}
```

That's it! The single `styles.scss` import includes everything needed.

## Architecture Overview

The styling architecture has three layers:

```
┌─────────────────────────────────────┐
│   Global Styles (styles.scss)      │  ← Import once in app entry
│   - Reset, Fonts, Themes           │
│   - Animations, Variables           │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   Component SCSS Files              │  ← Auto-imported with components
│   - Badge.scss, Card.scss, etc.    │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   CSS Custom Properties             │  ← Applied at runtime
│   - --color-brand-primary           │
│   - --color-background-primary      │
└─────────────────────────────────────┘
```

## Global Styles

### What's Included

The `styles.scss` file imports from two directories:

#### From `global/` Directory

| File | Purpose | Key Features |
|------|---------|--------------|
| `_reset.scss` | CSS reset | Consistent baseline across browsers |
| `_fonts.scss` | Font declarations | Inter (variable weights), Founders Grotesk |
| `_themes.scss` | **Theme variables** | Light/dark mode, 80+ CSS custom properties |
| `_animations.scss` | Global animations | `e-spin`, `e-fade-in`, `e-svg-stroke`, etc. |
| `_transitions.scss` | Transition utilities | Standard timing functions |
| `_helpers.scss` | Helper classes | Utility classes |
| `_layout.scss` | Layout utilities | Flexbox, grid helpers |
| `_no-scroll.scss` | Scroll lock | For modals |

#### From `scss/` Directory

| File | Purpose | Variables Provided |
|------|---------|-------------------|
| `_variables.scss` | Core variables | Timing, easing, z-indexes |
| `_colors.scss` | Color palette | `$c-gray-50`, `$n-yellow-200`, etc. |
| `_typography.scss` | Typography | Font sizes, weights, line heights |
| `_spaces.scss` | Spacing system | `$space-s`, `$space-m`, `$space-l`, etc. |
| `_borders.scss` | Border system | Border radius, widths |
| `_elevations.scss` | Shadows | Box shadow mixins |
| `_screen.scss` | Breakpoints | Mobile, tablet, desktop mixins |
| `_mixins.scss` | SCSS mixins | Reusable style patterns |
| `_placeholders.scss` | Placeholders | `%keyboard-nav-focus`, etc. |
| `_icons.scss` | Icon sizing | Icon size variables |

### Import Order (Handled Automatically)

The `styles.scss` file imports in this specific order to avoid dependency issues:

1. **Resets first** - Clean slate
2. **Fonts** - Before they're used
3. **Themes** - Define CSS custom properties
4. **Animations** - Global keyframes
5. **Variables** - SCSS variables
6. **Utilities** - Mixins, placeholders, helpers

## Component Styles

### How Component Styles Work

Each component (e.g., `Badge.jsx`) automatically imports its SCSS file:

```jsx
// Badge.jsx
import './Badge.scss';  // Automatically imported

const Badge = ({ variant, children }) => {
  return <span className={`badge badge--variant-${variant}`}>{children}</span>;
};
```

### Component SCSS Structure

```scss
// Badge.scss
// Import only what this component needs
@import '../scss/variables';
@import '../scss/spaces';
@import '../scss/typography';
@import '../scss/colors';
@import '../scss/borders';

// Component styles
.badge {
  display: inline-flex;
  height: $space-l;              // SCSS variable from _spaces.scss
  border-radius: $border-radius-full;  // SCSS variable from _borders.scss
  color: var(--color-text-inverse-primary);  // CSS custom property from _themes.scss
}
```

### Key Points

- ✅ Component SCSS imports are **scoped to what's needed**
- ✅ Uses **SCSS variables** for static values (spacing, sizes)
- ✅ Uses **CSS custom properties** for theme colors
- ✅ No need to manually import component SCSS (it's automatic)

## Theme System

### Light and Dark Mode

Themes are defined in `global/_themes.scss` using CSS custom properties:

```scss
// Light theme (default)
:root,
.light {
  --color-brand-primary: #3a3a3a;
  --color-background-primary: #ffffff;
  --color-text-primary: #3a3a3a;
}

// Dark theme
.dark {
  --color-brand-primary: #ffffff;
  --color-background-primary: #1a1a1a;
  --color-text-primary: #ffffff;
}
```

### Using Themes in Your App

Apply the `dark` class to switch themes:

```jsx
function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle Theme
      </button>
      <Badge variant="featured">Theme-aware badge</Badge>
    </div>
  );
}
```

### Available Theme Variables

Over 80 CSS custom properties are available, including:

**Brand Colors:**
- `--color-brand-primary`
- `--color-brand-secondary`
- `--color-brand-featured`

**Background Colors:**
- `--color-background-primary`
- `--color-background-secondary`
- `--color-background-tertiary`
- `--color-background-elevation-1`
- `--color-background-elevation-2`

**Text Colors:**
- `--color-text-primary`
- `--color-text-secondary`
- `--color-text-inverse-primary`

**Button Colors:**
- `--color-button-background-primary`
- `--color-button-background-secondary`
- `--color-button-content-primary`

**Form Colors:**
- `--color-form-border-default`
- `--color-form-border-hover`
- `--color-form-border-primary-active`

**State Colors:**
- `--color-error`
- `--color-success`
- `--color-disabled`
- `--color-focused`

See `global/_themes.scss` for the complete list.

## Customization

### Option 1: Override CSS Custom Properties

The easiest way to customize is to override CSS custom properties:

```css
/* In your own CSS file */
:root {
  --color-brand-primary: #ff6b00;  /* Your brand color */
  --color-brand-secondary: #00a854;
  --color-background-primary: #fafafa;
}
```

### Option 2: Override SCSS Variables

Create a custom variables file before importing:

```scss
// custom-variables.scss
$space-unit: 8px;  // Change base spacing
$font-size-base: 16px;  // Change base font size
$border-radius-base: 4px;  // Change border radius

// Then import the main styles
@import './react-components/styles.scss';
```

### Option 3: Add Custom Themes

Extend the theme system:

```scss
// custom-themes.scss
@import './react-components/styles.scss';

// Add a custom theme
.theme-ocean {
  --color-brand-primary: #0066cc;
  --color-brand-secondary: #00a8e8;
  --color-background-primary: #e6f2ff;
  --color-text-primary: #003d66;
}
```

### Option 4: Component-Specific Overrides

Override specific component styles:

```css
/* In your own CSS file, loaded after component styles */
.badge {
  font-size: 14px;  /* Override font size */
  height: 28px;     /* Override height */
}

.badge--variant-featured {
  background: linear-gradient(45deg, #ff6b00, #ff8800);
}
```

## Troubleshooting

### Components Have No Styling

**Problem:** Components render but have no styles.

**Solution:** Make sure you imported `styles.scss` in your entry file:

```javascript
// At the TOP of index.js or App.js
import './react-components/styles.scss';
```

### Fonts Not Loading

**Problem:** Text appears in fallback fonts.

**Solution:** 
1. Check that `styles.scss` is imported
2. Verify the font URLs in `global/_fonts.scss` are accessible
3. Check browser Network tab for 404 errors on font files

### Colors Look Wrong

**Problem:** Components use wrong colors or look broken.

**Solution:**
1. Ensure `global/_themes.scss` is loaded (via `styles.scss`)
2. Check that you haven't accidentally overridden CSS custom properties
3. Verify your element has the correct theme class (`:root`, `.light`, or `.dark`)

### Dark Mode Not Working

**Problem:** Dark mode styles not applying.

**Solution:**
1. Add the `dark` class to a parent element:
   ```jsx
   <div className="dark">
     <YourApp />
   </div>
   ```
2. Ensure `global/_themes.scss` is loaded

### SCSS Compilation Errors

**Problem:** Build fails with SCSS errors.

**Solution:**
1. Install `sass`: `npm install sass`
2. Check your build tool configuration (webpack/vite)
3. Make sure all import paths are correct
4. Clear your build cache and rebuild

### Spacing/Sizing Issues

**Problem:** Components have wrong spacing or sizes.

**Solution:**
1. Check that `scss/_spaces.scss` is loading
2. Verify you haven't overridden spacing variables
3. Check browser DevTools to see computed values

### Icons Not Showing

**Problem:** Icon component renders but no icon appears.

**Solution:**
1. Verify the icon exists in `components/icons/[size]/[icon].svg`
2. Check browser console for import errors
3. Ensure SVG files are included in your build process

## Best Practices

### Do's ✅

- ✅ Import `styles.scss` once in your main entry file
- ✅ Use CSS custom properties for theme colors
- ✅ Use SCSS variables for fixed values (spacing, sizes)
- ✅ Test both light and dark modes
- ✅ Keep component-specific overrides minimal
- ✅ Follow the existing naming conventions

### Don'ts ❌

- ❌ Don't import `styles.scss` in multiple files
- ❌ Don't modify the original SCSS files directly
- ❌ Don't use hardcoded colors (use CSS custom properties)
- ❌ Don't override too many component styles (breaks consistency)
- ❌ Don't skip the global styles import

## Performance Tips

1. **Tree Shaking**: Import only the components you need
   ```javascript
   // Good
   import { Badge, Card } from './react-components';
   
   // Less optimal (imports everything)
   import * as Components from './react-components';
   ```

2. **CSS Bundling**: Let your build tool handle CSS bundling (webpack, vite do this automatically)

3. **Font Loading**: The fonts use `font-display: fallback` for optimal performance

4. **Dark Mode**: Use the `dark` class toggle rather than inline styles for better performance

## Additional Resources

- **Full Component List**: See [README.md](./README.md)
- **Conversion Details**: See [CONVERSION_SUMMARY.md](./CONVERSION_SUMMARY.md)
- **Quick Start**: See [QUICK_START.md](./QUICK_START.md)
- **Original Vue Components**: Check `../components/` folder
- **SCSS Variables Reference**: Check individual files in `../scss/` folder
- **Theme Variables**: See `../global/_themes.scss`

