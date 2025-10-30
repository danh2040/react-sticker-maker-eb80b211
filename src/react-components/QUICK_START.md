# Quick Start Guide

Get started with the React components in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install react react-dom prop-types sass
```

## Step 2: Configure Your Build Tool

### For Create React App
CRA includes SASS support by default. Just import the SCSS files!

### For Vite
```bash
npm install -D sass
```

In `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Optional: add global variables
      }
    }
  }
})
```

### For Webpack
```bash
npm install -D sass-loader sass
```

In `webpack.config.js`:
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
}
```

## Step 3: Import Global Styles

**CRITICAL**: Import the main styles file once in your app entry point (e.g., `index.js` or `App.js`):

```javascript
// At the TOP of your main entry file (index.js or App.js)
import './react-components/styles.scss';
```

This imports:
- ✅ CSS reset for consistent styling
- ✅ Font declarations (Inter, Founders Grotesk)
- ✅ Theme variables (light/dark mode support)
- ✅ Global animations and transitions
- ✅ All base SCSS variables

**Without this import, components won't display correctly!**

## Step 4: Import and Use Components

```jsx
import React, { useState } from 'react';
// Import global styles FIRST (do this once in your entry file)
import './react-components/styles.scss';

// Then import components
import { Badge, Card, Input } from './react-components';

function App() {
  const [value, setValue] = useState('');

  return (
    <div>
      <Badge variant="featured">New Feature!</Badge>
      
      <Card padding border>
        <h2>Welcome</h2>
        <Input 
          value={value}
          onChange={setValue}
          placeholder="Type something..."
        />
      </Card>
    </div>
  );
}

export default App;
```

## Common Use Cases

### Form with Validation
```jsx
import { Input, Checkbox, Card } from './react-components';
import { useState } from 'react';

function ContactForm() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.includes('@')) {
      newErrors.email = 'Invalid email';
    }
    if (!agreed) {
      newErrors.agreed = 'You must agree';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form valid!');
    }
  };

  return (
    <Card padding border>
      <form onSubmit={handleSubmit}>
        <Input
          value={email}
          onChange={setEmail}
          placeholder="Email"
          invalid={!!errors.email}
          type="email"
        />
        {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}
        
        <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
          <Checkbox
            value={agreed}
            onChange={setAgreed}
            name="agree"
          />
          <label>I agree to terms</label>
        </div>
        {errors.agreed && <p style={{color: 'red'}}>{errors.agreed}</p>}
        
        <button type="submit" style={{marginTop: '1rem'}}>
          Submit
        </button>
      </form>
    </Card>
  );
}
```

### Modal Dialog
```jsx
import { Modal, Card } from './react-components';
import { useState } from 'react';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Open Settings
      </button>

      <Modal
        active={showModal}
        onClose={() => setShowModal(false)}
        size="m"
        header={<h2>Settings</h2>}
        footer={
          <div style={{display: 'flex', gap: '1rem'}}>
            <button onClick={() => setShowModal(false)}>Cancel</button>
            <button onClick={() => { /* save */ setShowModal(false); }}>
              Save
            </button>
          </div>
        }
      >
        <p>Your settings content here...</p>
      </Modal>
    </>
  );
}
```

### Status Badges
```jsx
import { Badge } from './react-components';

function StatusIndicator({ status }) {
  const variantMap = {
    active: 'featured',
    pending: 'accent-yellow',
    inactive: 'neutral'
  };

  return (
    <Badge variant={variantMap[status]}>
      {status.toUpperCase()}
    </Badge>
  );
}
```

### Loading State
```jsx
import { Loading, Card } from './react-components';
import { useState, useEffect } from 'react';

function DataDisplay() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Card padding>
        <Loading />
      </Card>
    );
  }

  return (
    <Card padding border>
      <h2>Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Card>
  );
}
```

### User Avatar Display
```jsx
import { Avatar, Card } from './react-components';

function UserProfile({ user }) {
  return (
    <Card padding border>
      <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
        <Avatar
          isSignedIn={user.isSignedIn}
          picture={user.avatar}
          size="l"
        />
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </div>
    </Card>
  );
}
```

### Tooltips for Help Text
```jsx
import { Tooltip, Icon } from './react-components';

function HelpText({ label, helpText }) {
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
      <label>{label}</label>
      <Tooltip
        content={helpText}
        side="center-top"
        size="s"
      >
        <Icon icon="info-circle" size="s" />
      </Tooltip>
    </div>
  );
}
```

## Troubleshooting

### Issue: SCSS not compiling
**Solution**: Make sure you have `sass` installed and your build tool is configured to handle `.scss` files.

### Issue: Icons not loading
**Solution**: Ensure the `components/icons/` directory is accessible from your React app. You may need to copy it or adjust import paths.

### Issue: Components not styled
**Solution**: Check that SCSS files are being imported. You can manually import them:
```javascript
import './react-components/Badge.scss';
```

### Issue: PropTypes warnings
**Solution**: Make sure you're passing the correct prop types. Check the README.md for prop specifications.

### Issue: Modal not closing on click outside
**Solution**: Ensure `onClose` prop is provided and properly handles the modal state.

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure build tool
3. ✅ Import components
4. 📚 Read the full [README.md](./README.md) for all component props
5. 🎨 Customize SCSS variables in `scss/_variables.scss`
6. 🧪 Write tests for your implementations
7. 📖 Check [CONVERSION_SUMMARY.md](./CONVERSION_SUMMARY.md) for detailed conversion notes

## Need Help?

- Check component prop documentation in README.md
- View working examples in example.html
- Review the original Vue components in `components/` folder
- Check SCSS variables in `scss/_variables.scss`

Happy coding! 🚀

