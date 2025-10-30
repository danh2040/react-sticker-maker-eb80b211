# React Components Library

This folder contains React versions of the Vue components, converted to use React hooks and patterns while maintaining the same SCSS styling from the original components.

## Components Included

1. **Badge** - Status or category indicators
2. **Card** - Content grouping container
3. **Checkbox** - Boolean input control
4. **Input** - Text input field with icon support
5. **Loading** - Animated loading spinner
6. **Avatar** - User profile image display
7. **Icon** - SVG icon component
8. **Modal** - Dialog overlay
9. **Tooltip** - Contextual information display

## Installation

```bash
npm install react react-dom prop-types
```

## Usage Examples

### Badge

```jsx
import { Badge } from './react-components';

function App() {
  return (
    <>
      <Badge variant="featured">Featured</Badge>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="accent-yellow">New</Badge>
    </>
  );
}
```

### Card

```jsx
import { Card } from './react-components';

function App() {
  return (
    <Card padding border>
      <h2>Card Title</h2>
      <p>Card content goes here</p>
    </Card>
  );
}
```

### Checkbox

```jsx
import { Checkbox } from './react-components';
import { useState } from 'react';

function App() {
  const [checked, setChecked] = useState(false);
  
  return (
    <Checkbox
      value={checked}
      onChange={setChecked}
      name="agree"
    />
  );
}
```

### Input

```jsx
import { Input } from './react-components';
import { useState } from 'react';

function App() {
  const [value, setValue] = useState('');
  
  return (
    <Input
      value={value}
      onChange={setValue}
      placeholder="Enter text..."
      icon="search"
      iconStart="user"
    />
  );
}
```

### Loading

```jsx
import { Loading } from './react-components';

function App() {
  return <Loading />;
}
```

### Avatar

```jsx
import { Avatar } from './react-components';

function App() {
  return (
    <>
      <Avatar isSignedIn={false} size="m" />
      <Avatar 
        isSignedIn={true} 
        picture="https://example.com/avatar.jpg" 
        size="l" 
      />
    </>
  );
}
```

### Icon

```jsx
import { Icon } from './react-components';

function App() {
  return (
    <>
      <Icon icon="check" size="s" />
      <Icon icon="close" size="m" />
      <Icon icon="search" size="l" />
    </>
  );
}
```

### Modal

```jsx
import { Modal } from './react-components';
import { useState } from 'react';

function App() {
  const [active, setActive] = useState(false);
  
  return (
    <>
      <button onClick={() => setActive(true)}>Open Modal</button>
      
      <Modal
        active={active}
        onClose={() => setActive(false)}
        size="m"
        header={<h2>Modal Title</h2>}
        footer={<button onClick={() => setActive(false)}>Close</button>}
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

### Tooltip

```jsx
import { Tooltip } from './react-components';

function App() {
  return (
    <Tooltip
      content="This is helpful information"
      side="center-top"
      size="m"
    >
      <button>Hover me</button>
    </Tooltip>
  );
}
```

## Styling

All components reference the existing SCSS files from both the `../scss/` and `../global/` directories.

### Global Styles Import

**IMPORTANT**: You must import the main `styles.scss` file once in your app entry point to include all global styles:

```javascript
// In your main App.js or index.js
import './react-components/styles.scss';
```

This single import includes:

#### From `global/` directory:
   - `_reset.scss` - CSS reset for consistent cross-browser styling
   - `_fonts.scss` - Font-face declarations (Inter, Founders Grotesk)
   - `_themes.scss` - Theme variables (light/dark mode, --color-* variables)
   - `_animations.scss` - Global keyframe animations (e-spin, e-svg-stroke, etc.)
   - `_transitions.scss` - Transition utilities
   - `_helpers.scss` - Helper classes
   - `_layout.scss` - Layout utilities
   - `_no-scroll.scss` - Scroll lock utilities for modals

#### From `scss/` directory:
   - `_variables.scss` - Base SCSS variables
   - `_colors.scss` - Color palette
   - `_typography.scss` - Typography variables
   - `_spaces.scss` - Spacing system
   - `_borders.scss` - Border utilities
   - `_elevations.scss` - Box shadow elevations
   - `_scale.scss` - Scale system
   - `_screen.scss` - Responsive breakpoints
   - `_mixins.scss` - SCSS mixins
   - `_placeholders.scss` - SCSS placeholders
   - `_icons.scss` - Icon sizing
   - `_stack.scss` - Stack utilities
   - `_layout.scss` - Layout utilities
   - `_opacity.scss` - Opacity utilities

### Individual Component Styles

Each component imports only the specific SCSS utilities it needs. The global theme variables (like `--color-*`) are defined in `global/_themes.scss` and work through CSS custom properties.

## Component Props

### Badge
- `variant`: 'featured' | 'neutral' | 'accent-yellow' (default: 'featured')
- `children`: React.ReactNode

### Card
- `as`: 'div' | 'a' | 'button' (default: 'div')
- `overflowVisible`: boolean (default: false)
- `padding`: boolean (default: false)
- `border`: boolean (default: false)

### Checkbox
- `id`: string
- `value`: boolean | string | array
- `name`: string | number
- `required`: boolean (default: false)
- `disabled`: boolean (default: false)
- `onChange`: (value) => void

### Input
- `value`: string | number
- `name`: string
- `type`: string (default: 'text')
- `icon`: string
- `iconStart`: string
- `iconSize`: string (default: 'm')
- `placeholder`: string
- `required`: boolean
- `disabled`: boolean
- `invalid`: boolean
- `onChange`: (value) => void

### Loading
No props required

### Avatar
- `isSignedIn`: boolean (default: false)
- `picture`: string
- `size`: 'xs' | 's' | 'm' | 'l' | 'xl' (default: 's')

### Icon
- `icon`: string (required)
- `size`: 'l' | 'm' | 's' (default: 'm')

### Modal
- `active`: boolean
- `closeButton`: boolean (default: true)
- `size`: 's' | 'm' | 'l' | 'xl' (default: 'm')
- `padding`: 'none' | 'm' | '2l' | '4l' (default: '4l')
- `onClose`: (reason) => void
- `feature`: React.ReactNode
- `header`: React.ReactNode
- `footer`: React.ReactNode

### Tooltip
- `content`: React.ReactNode
- `side`: See TooltipSides export (default: 'left-top')
- `size`: 'l' | 'm' | 's' (default: 'm')
- `focusable`: boolean (default: true)
- `padding`: boolean (default: true)
- `openOnHover`: boolean (default: true)
- `closeOnMouseLeave`: boolean (default: false)

## Notes

- All components are functional components using React hooks
- PropTypes validation is included for development
- SCSS modules maintain the same class names as the Vue components
- Icons are loaded dynamically from the `../components/icons/` directory
- Components follow React best practices and patterns

## Browser Support

Same as the original Vue components. Ensure your build process includes appropriate polyfills for older browsers.
