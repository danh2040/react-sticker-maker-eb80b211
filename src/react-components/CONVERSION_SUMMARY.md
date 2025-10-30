# React Components Conversion Summary

## Overview
Successfully converted 10 Vue components from the `components/` folder to React, maintaining the original SCSS styling and functionality.

## Components Converted

### 1. Badge (`Badge.jsx`)
- **Original**: `components/badge/index.vue`
- **Features**: 
  - Three variants: featured, neutral, accent-yellow
  - Inline display with rounded corners
  - SCSS styling from original component
- **Props**: `variant`, `children`, `className`

### 2. Card (`Card.jsx`)
- **Original**: `components/card/index.vue`
- **Features**:
  - Polymorphic component (can render as div, a, or button)
  - Optional padding, border, and overflow visibility
  - Hover and focus states for interactive versions
- **Props**: `as`, `overflowVisible`, `padding`, `border`, `children`, `className`

### 3. Checkbox (`Checkbox.jsx`)
- **Original**: `components/checkbox/index.vue`
- **Features**:
  - Custom styled checkbox with check icon
  - Keyboard navigation support (Enter/Space)
  - Disabled state handling
  - Larger touch target for better accessibility
- **Props**: `id`, `value`, `name`, `required`, `disabled`, `onChange`, `className`

### 4. Input (`Input.jsx`)
- **Original**: `components/input/index.vue`
- **Features**:
  - Text input with icon support (start/end positions)
  - Can render as button for specific use cases
  - Invalid state styling
  - Number input support with proper type handling
- **Props**: `asButton`, `value`, `name`, `type`, `icon`, `iconStart`, `iconSize`, `placeholder`, `required`, `disabled`, `invalid`, `ariaControls`, `ariaExpanded`, `ariaLabel`, `onChange`, `className`

### 5. Loading (`Loading.jsx`)
- **Original**: `components/loading/index.vue`
- **Features**:
  - Animated spinner with Ecosia logo
  - CSS animations for rotation and dash effects
  - Accessible with aria-label
- **Props**: `className`

### 6. Avatar (`Avatar.jsx`)
- **Original**: `components/avatar/index.vue`
- **Features**:
  - Five size options (xs, s, m, l, xl)
  - Signed in/out states
  - Image error handling with fallback
  - Circular styling
- **Props**: `isSignedIn`, `picture`, `size`, `className`

### 7. Icon (`Icon.jsx`)
- **Original**: `components/icon/index.vue`
- **Features**:
  - Dynamic SVG loading from icons directory
  - Three size options (s, m, l)
  - Support for animations (spinner, check-circle)
  - Loads icons from `components/icons/[size]/[icon].svg`
- **Props**: `icon` (required), `size`, `className`

### 8. Modal (`Modal.jsx`)
- **Original**: `components/modal/index.vue`
- **Features**:
  - Four size options (s, m, l, xl)
  - Optional close button, header, footer, and feature section
  - Scroll lock on body when active
  - Keyboard navigation (Escape to close)
  - Click outside to close
  - Scrollable content with shadow indicators
- **Props**: `active`, `closeButton`, `elevationBackground`, `featureSize`, `padding`, `size`, `role`, `scrollableBody`, `onClose`, `onModalDisplay`, `feature`, `header`, `footer`, `children`, `className`

### 9. Tooltip (`Tooltip.jsx`)
- **Original**: `components/tooltip/index.vue`
- **Features**:
  - Nine positioning options
  - Three size options (s, m, l)
  - Hover, focus, and click interactions
  - Keyboard navigation
  - Auto-close on scroll
  - Delay on hide for better UX
- **Props**: `focusable`, `padding`, `side`, `size`, `openOnHover`, `closeOnMouseLeave`, `openOnFocus`, `openOnStart`, `colorVariant`, `closeOnScroll`, `content`, `children`, `onTooltipOpened`, `onTooltipHovered`, `className`

## SCSS Architecture

### Global Styles Entry Point

A main `styles.scss` file provides a single entry point for all global styles:

```scss
// Global foundation styles (from global/ directory)
@import '../global/reset';        // CSS reset
@import '../global/fonts';        // Font declarations
@import '../global/themes';       // Theme variables (light/dark)
@import '../global/animations';   // Global keyframes
@import '../global/transitions';  // Transition utilities
@import '../global/helpers';      // Helper classes
@import '../global/layout';       // Layout utilities
@import '../global/no-scroll';    // Modal scroll lock

// Base SCSS variables and utilities (from scss/ directory)
@import '../scss/variables';
@import '../scss/colors';
@import '../scss/typography';
@import '../scss/spaces';
@import '../scss/borders';
@import '../scss/elevations';
// ... and more
```

**Import this once in your app entry point:**
```javascript
import './react-components/styles.scss';
```

### Component-Level Styles

Each component has its own SCSS file that imports only what it needs from the `scss/` directory:

```scss
// Example: Badge.scss
@import '../scss/variables';
@import '../scss/spaces';
@import '../scss/typography';
@import '../scss/colors';
@import '../scss/borders';

.badge {
  // Component styles using SCSS variables
  // and CSS custom properties from global/_themes.scss
}
```

### Theme Variables

Theme colors (like `--color-brand-primary`, `--color-background-primary`, etc.) are defined in `global/_themes.scss` and work through CSS custom properties, supporting both light and dark modes automatically.

## Key Conversion Patterns

### 1. Vue → React Component Structure
**Vue:**
```vue
<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script>
export default {
  props: { variant: String },
  computed: {
    classes() { /* ... */ }
  }
}
</script>
```

**React:**
```jsx
const Component = ({ variant, children }) => {
  const classes = ['component', `component--${variant}`].join(' ');
  return <div className={classes}>{children}</div>;
};
```

### 2. Reactive Data → useState
**Vue:**
```javascript
data() {
  return { value: '' }
}
```

**React:**
```javascript
const [value, setValue] = useState('');
```

### 3. Lifecycle Hooks → useEffect
**Vue:**
```javascript
mounted() { /* ... */ }
beforeDestroy() { /* ... */ }
```

**React:**
```javascript
useEffect(() => {
  // mounted logic
  return () => {
    // beforeDestroy logic
  };
}, []);
```

### 4. Computed Properties → useMemo or inline
**Vue:**
```javascript
computed: {
  fullName() {
    return `${this.first} ${this.last}`;
  }
}
```

**React:**
```javascript
const fullName = `${first} ${last}`;
// or for expensive computations:
const fullName = useMemo(() => `${first} ${last}`, [first, last]);
```

### 5. Event Handling
**Vue:**
```vue
<button @click="handleClick">Click</button>
```

**React:**
```jsx
<button onClick={handleClick}>Click</button>
```

## File Structure

```
react-components/
├── Avatar.jsx
├── Avatar.scss
├── Badge.jsx
├── Badge.scss
├── Card.jsx
├── Card.scss
├── Checkbox.jsx
├── Checkbox.scss
├── Icon.jsx
├── Icon.scss
├── Input.jsx
├── Input.scss
├── Loading.jsx
├── Loading.scss
├── Modal.jsx
├── Modal.scss
├── Tooltip.jsx
├── Tooltip.scss
├── index.js              # Main export file
├── package.json          # Dependencies
├── README.md             # Usage documentation
├── CONVERSION_SUMMARY.md # This file
└── example.html          # Demo page
```

## Dependencies

- **react**: ^16.8.0 || ^17.0.0 || ^18.0.0
- **react-dom**: ^16.8.0 || ^17.0.0 || ^18.0.0
- **prop-types**: ^15.8.1

## Usage

### Installation
```bash
npm install react react-dom prop-types
```

### Import Components
```javascript
import { Badge, Card, Checkbox, Input, Loading, Avatar, Icon, Modal, Tooltip } from './react-components';
```

### Use in Your App
```jsx
function App() {
  return (
    <div>
      <Badge variant="featured">New</Badge>
      <Card padding border>
        <h2>Hello World</h2>
      </Card>
    </div>
  );
}
```

## Testing the Components

1. Open `example.html` in a browser to see all components in action
2. Each component includes PropTypes validation for development
3. All components maintain the same visual appearance as Vue originals

## Differences from Vue Components

### Icon Component
- Vue version uses dynamic imports with webpack magic comments
- React version uses dynamic imports with `import()` function
- Both load SVGs from the same `components/icons/` directory

### Modal Component
- Vue version uses `vue-clickaway` mixin
- React version implements click-outside detection natively
- Both provide the same functionality

### Checkbox Component
- Vue version uses `$refs` for input delegation
- React version uses `useRef` hook
- Both provide keyboard and mouse interaction

### Event Emission
- Vue: `this.$emit('input', value)`
- React: `onChange?.(value)` with optional callback

## Browser Support

Same as original Vue components. Ensure your build process includes:
- Babel for JSX transformation
- SCSS loader for styling
- Appropriate polyfills for older browsers

## Future Enhancements

Potential improvements for these components:

1. **TypeScript Support**: Add .d.ts files or convert to .tsx
2. **Unit Tests**: Add Jest/React Testing Library tests
3. **Storybook**: Create interactive component documentation
4. **CSS Modules**: Optional support for scoped styles
5. **Additional Components**: Convert remaining Vue components as needed

## Notes

- All components are functional components using hooks
- PropTypes provide runtime type checking
- SCSS files reference the original design system variables
- Components maintain the same class names for CSS compatibility
- Accessibility features are preserved from Vue originals

