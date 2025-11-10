import { Badge, AdPill, Accordion, AccordionItem, Avatar, Switch, Tooltip, Slider, Popover } from "@/components/ecosia";
import { PrimaryButton, SecondaryButton, OutlineButton, GhostButton, DestructiveButton, LinkButton } from "@/components/button-variants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  
  const sliderData = [
    {
      title: "Beautiful Design",
      description: "Discover our amazing features that will transform your experience.",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
    },
    {
      title: "Easy to Use",
      description: "Simple and intuitive interface designed for everyone.",
      imageUrl: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=400&fit=crop"
    },
    {
      title: "Fast Performance",
      description: "Lightning fast performance that keeps you productive.",
      imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Component Showcase</h1>
          <Link to="/demo">
            <PrimaryButton>View Demo Profile</PrimaryButton>
          </Link>
        </div>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <PrimaryButton>Primary</PrimaryButton>
            <SecondaryButton>Secondary</SecondaryButton>
            <OutlineButton>Outline</OutlineButton>
            <GhostButton>Ghost</GhostButton>
            <DestructiveButton>Destructive</DestructiveButton>
            <LinkButton>Link</LinkButton>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button Sizes</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Disabled Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled Primary</Button>
            <Button variant="secondary" disabled>Disabled Secondary</Button>
            <Button variant="outline" disabled>Disabled Outline</Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Badges</h2>
          <div className="flex gap-4">
            <Badge variant="featured">Featured</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="accent-yellow">Accent</Badge>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Ad Pill</h2>
          <AdPill />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Avatar Sizes</h2>
          <div className="flex gap-4 items-center">
            <Avatar size="s">JD</Avatar>
            <Avatar size="m">JD</Avatar>
            <Avatar size="l">JD</Avatar>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Accordion</h2>
          <Accordion defaultOpenIndex={0}>
            <AccordionItem index={0} title="First Item">
              Content for first item
            </AccordionItem>
            <AccordionItem index={1} title="Second Item">
              Content for second item
            </AccordionItem>
            <AccordionItem index={2} title="Third Item">
              Content for third item
            </AccordionItem>
          </Accordion>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Switch</h2>
          <Switch
            name="demo-switch"
            label="Enable notifications"
            description="Receive updates about your account activity"
            checked={switchChecked}
            onChange={setSwitchChecked}
          />
          <p className="text-sm text-gray-600">
            Current state: {switchChecked ? 'On' : 'Off'}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Tooltip</h2>
          <div className="flex flex-wrap gap-8 items-center">
            <Tooltip content="This is a helpful tooltip!" side="center-top">
              <Button variant="outline">Hover me (Top)</Button>
            </Tooltip>
            <Tooltip content="Tooltip on the right side" side="right-center">
              <Button variant="outline">Hover me (Right)</Button>
            </Tooltip>
            <Tooltip 
              content="This is a larger tooltip with more information!" 
              size="l"
              colorVariant="brand-secondary"
            >
              <Button variant="outline">Large Secondary Tooltip</Button>
            </Tooltip>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Popover</h2>
          <div className="flex gap-8 items-center">
            <Popover
              visible={popoverVisible}
              side="center-bottom"
              content={
                <div>
                  <p className="font-semibold mb-2">Popover Content</p>
                  <p className="text-sm">This is a popover with white background and can contain any content.</p>
                </div>
              }
            >
              <Button 
                variant="outline" 
                onClick={() => setPopoverVisible(!popoverVisible)}
              >
                Toggle Popover
              </Button>
            </Popover>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Slider</h2>
          <Slider slides={sliderData} />
        </section>
      </div>
    </div>
  );
};

export default Index;
