import { Badge, AdPill, Accordion, AccordionItem, Avatar, AISearchButton } from "@/components/ecosia";
import { PrimaryButton, SecondaryButton, OutlineButton, GhostButton, DestructiveButton, LinkButton } from "@/components/button-variants";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold mb-8">Component Showcase</h1>
        
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
          <h2 className="text-2xl font-semibold">AI Search Button</h2>
          <AISearchButton onClick={() => alert('AI Search!')} />
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
      </div>
    </div>
  );
};

export default Index;
