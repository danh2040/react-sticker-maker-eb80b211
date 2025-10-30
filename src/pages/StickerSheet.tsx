import { useState } from 'react';
import Badge from '@/react-components/Badge';
import Card from '@/react-components/Card';
import Checkbox from '@/react-components/Checkbox';
import Input from '@/react-components/Input';
import Avatar from '@/react-components/Avatar';

const StickerSheet = () => {
  const [checked, setChecked] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Component Sticker Sheet</h1>
          <p className="text-muted-foreground">
            Showcasing 5 React components from src/react-components
          </p>
        </header>

        {/* Badge Component */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Badge</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Status or category indicators with different variants
            </p>
          </div>
          <div className="flex flex-wrap gap-4 p-6 bg-card rounded-lg border">
            <Badge variant="featured">Featured</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="accent-yellow">Accent Yellow</Badge>
          </div>
        </section>

        {/* Card Component */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Card</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Content grouping container with various options
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card padding border>
              <h3 className="font-semibold mb-2">Default Card</h3>
              <p className="text-sm text-muted-foreground">
                A card with padding and border
              </p>
            </Card>
            <Card padding border overflowVisible>
              <h3 className="font-semibold mb-2">Overflow Visible</h3>
              <p className="text-sm text-muted-foreground">
                Content can overflow this card
              </p>
            </Card>
            <Card as="button" padding border>
              <h3 className="font-semibold mb-2">Clickable Card</h3>
              <p className="text-sm text-muted-foreground">
                This card is a button
              </p>
            </Card>
          </div>
        </section>

        {/* Checkbox Component */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Checkbox</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Boolean input control with custom styling
            </p>
          </div>
          <div className="flex flex-wrap gap-8 p-6 bg-card rounded-lg border items-center">
            <div className="flex items-center gap-3">
              <Checkbox value={checked} onChange={setChecked} />
              <span className="text-sm">
                Status: {checked ? 'Checked' : 'Unchecked'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox value={true} disabled />
              <span className="text-sm text-muted-foreground">Disabled (checked)</span>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox value={false} disabled />
              <span className="text-sm text-muted-foreground">Disabled (unchecked)</span>
            </div>
          </div>
        </section>

        {/* Input Component */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Input</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Text input field with icon support
            </p>
          </div>
          <div className="space-y-4 p-6 bg-card rounded-lg border">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Input</label>
              <Input
                placeholder="Enter text..."
                value={inputValue}
                onChange={setInputValue}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Disabled Input</label>
              <Input
                placeholder="This is disabled"
                disabled
                value="Disabled value"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Invalid Input</label>
              <Input
                placeholder="Invalid state"
                invalid
                value="Invalid value"
              />
            </div>
            <div className="mt-4 p-3 bg-muted rounded text-sm">
              Current value: <strong>{inputValue || '(empty)'}</strong>
            </div>
          </div>
        </section>

        {/* Avatar Component */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Avatar</h2>
            <p className="text-sm text-muted-foreground mb-4">
              User profile image display with different sizes
            </p>
          </div>
          <div className="space-y-6 p-6 bg-card rounded-lg border">
            <div>
              <h3 className="text-sm font-medium mb-3">Signed Out Placeholders</h3>
              <div className="flex flex-wrap items-end gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar isSignedIn={false} size="xs" />
                  <span className="text-xs text-muted-foreground">XS (24px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar isSignedIn={false} size="s" />
                  <span className="text-xs text-muted-foreground">S (32px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar isSignedIn={false} size="m" />
                  <span className="text-xs text-muted-foreground">M (48px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar isSignedIn={false} size="l" />
                  <span className="text-xs text-muted-foreground">L (64px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar isSignedIn={false} size="xl" />
                  <span className="text-xs text-muted-foreground">XL (96px)</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Signed In (Fallback)</h3>
              <div className="flex flex-wrap items-end gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar isSignedIn={true} size="s" />
                  <span className="text-xs text-muted-foreground">Small</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar isSignedIn={true} size="m" />
                  <span className="text-xs text-muted-foreground">Medium</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar isSignedIn={true} size="l" />
                  <span className="text-xs text-muted-foreground">Large</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StickerSheet;
