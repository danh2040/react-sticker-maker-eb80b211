import { Badge, AdPill, Accordion, AccordionItem, Avatar, Switch, Tooltip, Slider, Popover, Button } from "@/components/ecosia";
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ComponentSection } from "@/components/ComponentSection";
import { ComponentDemo } from "@/components/ComponentDemo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import ecosiaLogoDark from "@/assets/ecosia-logo-dark.svg";
import ecosiaLogoLight from "@/assets/ecosia-logo-light.svg";
import ecosiaLogoBrowserDark from "@/assets/ecosia-logo-browser-dark.svg";
import ecosiaLogoBrowserLight from "@/assets/ecosia-logo-browser-light.svg";
import ecosiaFaviconApp from "@/assets/ecosia-favicon-app.svg";
import ecosiaFaviconRounded from "@/assets/ecosia-favicon-rounded.svg";
import activeProjects from "@/assets/illustrations/active_projects.svg";
import ai from "@/assets/illustrations/AI.svg";
import areaRestored from "@/assets/illustrations/area_restored.svg";
import bookmark from "@/assets/illustrations/bookmark.svg";
import celebration from "@/assets/illustrations/celebration.svg";
import control from "@/assets/illustrations/control.svg";
import download from "@/assets/illustrations/download.svg";
import education from "@/assets/illustrations/education.svg";
import excitement from "@/assets/illustrations/excitement.svg";
import featureAdoption from "@/assets/illustrations/feature_adoption.svg";
import history from "@/assets/illustrations/history.svg";
import incognito from "@/assets/illustrations/incognito.svg";
import location from "@/assets/illustrations/location.svg";
import missionContinuity from "@/assets/illustrations/mission_continuity.svg";
import people from "@/assets/illustrations/people.svg";
import person from "@/assets/illustrations/person.svg";
import personalImpact from "@/assets/illustrations/personal_impact.svg";
import readingList from "@/assets/illustrations/reading_list.svg";
import renewableSolar from "@/assets/illustrations/renewable_solar.svg";
import renewableWind from "@/assets/illustrations/renewable_wind.svg";

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-4">
                {/* Mobile Menu */}
                <Sheet>
                  <SheetTrigger asChild className="md:hidden">
                    <button className="p-2 hover:bg-muted rounded-md">
                      <Menu className="h-5 w-5" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <div className="py-4">
                      <AppSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Desktop Sidebar Toggle */}
                <SidebarTrigger className="hidden md:block" />
                
                <h1 className="text-xl font-bold">Flora vibe code component library</h1>
              </div>
              
              <ThemeToggle />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 px-4 md:px-6 py-8">
            <div className="max-w-5xl mx-auto">
              {/* Logo Section */}
              <ComponentSection
                id="logo"
                title="Logo"
                description="The Ecosia logo represents our brand identity. Use the appropriate variant for light or dark backgrounds."
              >
                <ComponentDemo title="Variants">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground font-medium">Minimal Logo</p>
                      <div className="flex items-center justify-center py-8 bg-muted rounded-lg">
                        <img 
                          src={ecosiaLogoLight} 
                          alt="Ecosia Minimal Logo" 
                          className="h-7 dark:hidden"
                        />
                        <img 
                          src={ecosiaLogoDark} 
                          alt="Ecosia Minimal Logo" 
                          className="h-7 hidden dark:block"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground font-medium">Browser Logo</p>
                      <div className="flex items-center justify-center py-8 bg-muted rounded-lg">
                        <img 
                          src={ecosiaLogoBrowserLight} 
                          alt="Ecosia Browser Logo" 
                          className="h-12 dark:hidden"
                        />
                        <img 
                          src={ecosiaLogoBrowserDark} 
                          alt="Ecosia Browser Logo" 
                          className="h-12 hidden dark:block"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground font-medium">Favicon App (Square)</p>
                      <div className="flex items-center justify-center py-8 bg-muted rounded-lg">
                        <img 
                          src={ecosiaFaviconApp} 
                          alt="Ecosia Favicon App" 
                          className="h-12"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground font-medium">Favicon Rounded (Circle)</p>
                      <div className="flex items-center justify-center py-8 bg-muted rounded-lg">
                        <img 
                          src={ecosiaFaviconRounded} 
                          alt="Ecosia Favicon Rounded" 
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Illustrations Section */}
              <ComponentSection
                id="illustrations"
                title="Illustrations"
                description="Ecosia illustration assets for various use cases"
              >
                <ComponentDemo title="Variants">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold">All Variants</h3>
                      <Badge variant="featured">new</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={activeProjects} alt="Active Projects" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Active Projects</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={ai} alt="AI" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">AI</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={areaRestored} alt="Area Restored" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Area Restored</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={bookmark} alt="Bookmark" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Bookmark</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={celebration} alt="Celebration" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Celebration</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={control} alt="Control" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Control</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={download} alt="Download" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Download</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={education} alt="Education" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Education</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={excitement} alt="Excitement" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Excitement</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={featureAdoption} alt="Feature Adoption" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Feature Adoption</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={history} alt="History" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">History</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={incognito} alt="Incognito" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Incognito</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={location} alt="Location" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Location</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={missionContinuity} alt="Mission Continuity" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Mission Continuity</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={people} alt="People" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">People</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={person} alt="Person" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Person</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={personalImpact} alt="Personal Impact" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Personal Impact</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={readingList} alt="Reading List" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Reading List</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={renewableSolar} alt="Renewable Solar" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Renewable Solar</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={renewableWind} alt="Renewable Wind" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Renewable Wind</p>
                      </div>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Button Section */}
              <ComponentSection
                id="button"
                title="Button"
                description="Buttons allow users to take actions and make choices with a single tap. They communicate actions that users can take."
              >
                <ComponentDemo title="Interactive Example">
                  <Button variant="primary" onClick={() => alert('Button clicked!')}>
                    Click Me
                  </Button>
                </ComponentDemo>

                <ComponentDemo title="Variants">
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">Primary</p>
                      <Button variant="primary">Primary</Button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">Secondary</p>
                      <Button variant="secondary">Secondary</Button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">Outline</p>
                      <Button variant="outline">Outline</Button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">Ghost</p>
                      <Button variant="ghost">Ghost</Button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">Destructive</p>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy & Sizes">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Size: Small (sm)</p>
                      <Button size="sm">Small Button</Button>
                      <p className="text-xs text-muted-foreground">Height: 32px, Padding: 12px horizontal</p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Size: Default</p>
                      <Button size="default">Default Button</Button>
                      <p className="text-xs text-muted-foreground">Height: 40px, Padding: 16px horizontal</p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Size: Large (lg)</p>
                      <Button size="lg">Large Button</Button>
                      <p className="text-xs text-muted-foreground">Height: 48px, Padding: 24px horizontal</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Badge Section */}
              <ComponentSection
                id="badge"
                title="Badge"
                description="Badges are used to highlight an item's status or to draw attention to important information."
              >
                <ComponentDemo title="Interactive Example">
                  <Badge variant="featured">New Feature</Badge>
                </ComponentDemo>

                <ComponentDemo title="Variants">
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">Featured</p>
                      <Badge variant="featured">Featured</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">Neutral</p>
                      <Badge variant="neutral">Neutral</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">Accent Yellow</p>
                      <Badge variant="accent-yellow">Accent</Badge>
                    </div>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <Badge variant="featured">Badge Content</Badge>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Height: Auto (content-based)</p>
                      <p>• Padding: 4px horizontal, 2px vertical</p>
                      <p>• Border radius: 4px</p>
                      <p>• Font size: 12px</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Avatar Section */}
              <ComponentSection
                id="avatar"
                title="Avatar"
                description="Avatars represent users or entities. They can display initials, images, or icons."
              >
                <ComponentDemo title="Interactive Example">
                  <Avatar size="m">JD</Avatar>
                </ComponentDemo>

                <ComponentDemo title="Sizes">
                  <div className="flex flex-wrap gap-6 items-center">
                    <div className="space-y-2 text-center">
                      <Avatar size="s">JD</Avatar>
                      <p className="text-xs text-muted-foreground">Small (24px)</p>
                    </div>
                    <div className="space-y-2 text-center">
                      <Avatar size="m">JD</Avatar>
                      <p className="text-xs text-muted-foreground">Medium (32px)</p>
                    </div>
                    <div className="space-y-2 text-center">
                      <Avatar size="l">JD</Avatar>
                      <p className="text-xs text-muted-foreground">Large (48px)</p>
                    </div>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <Avatar size="m">AB</Avatar>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Circular shape</p>
                      <p>• Centered content (text or image)</p>
                      <p>• Background color from theme</p>
                      <p>• 2-character initials maximum</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Switch Section */}
              <ComponentSection
                id="switch"
                title="Switch"
                description="Switches toggle the state of a single setting on or off. They provide immediate feedback on the current state."
              >
                <ComponentDemo title="Interactive Example">
                  <Switch
                    name="demo-switch"
                    label="Enable notifications"
                    description="Receive updates about your account activity"
                    checked={switchChecked}
                    onChange={setSwitchChecked}
                  />
                  <p className="text-sm text-muted-foreground mt-4">
                    Current state: <span className="font-medium">{switchChecked ? 'On' : 'Off'}</span>
                  </p>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-4">
                    <Switch
                      name="anatomy-demo"
                      label="Label text"
                      description="Optional description text"
                      checked={false}
                      onChange={() => {}}
                    />
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Toggle track: 44px width × 24px height</p>
                      <p>• Toggle thumb: 20px diameter</p>
                      <p>• Label: Optional, positioned to the right</p>
                      <p>• Description: Optional secondary text</p>
                      <p>• Spacing: 12px between switch and labels</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Tooltip Section */}
              <ComponentSection
                id="tooltip"
                title="Tooltip"
                description="Tooltips display informative text when users hover over, focus on, or tap an element."
              >
                <ComponentDemo title="Interactive Example">
                  <Tooltip content="This is a helpful tooltip!" side="center-top">
                    <Button variant="outline">Hover me</Button>
                  </Tooltip>
                </ComponentDemo>

                <ComponentDemo title="Positions">
                  <div className="flex flex-wrap gap-4 items-center">
                    <Tooltip content="Top tooltip" side="center-top">
                      <Button variant="outline">Top</Button>
                    </Tooltip>
                    <Tooltip content="Right tooltip" side="right-center">
                      <Button variant="outline">Right</Button>
                    </Tooltip>
                    <Tooltip content="Bottom tooltip" side="center-bottom">
                      <Button variant="outline">Bottom</Button>
                    </Tooltip>
                    <Tooltip content="Left tooltip" side="left-center">
                      <Button variant="outline">Left</Button>
                    </Tooltip>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy & Variants">
                  <div className="space-y-4">
                    <Tooltip content="Default size tooltip" size="m">
                      <Button variant="outline">Default Size</Button>
                    </Tooltip>
                    <Tooltip content="Large tooltip with more content" size="l" colorVariant="brand-secondary">
                      <Button variant="outline">Large Secondary</Button>
                    </Tooltip>
                    <div className="text-sm text-muted-foreground space-y-1 mt-4">
                      <p>• Padding: 8px horizontal, 6px vertical</p>
                      <p>• Max width: Size dependent (m: 200px, l: 300px)</p>
                      <p>• Arrow: 8px positioned on appropriate side</p>
                      <p>• Animation: Fade in/out with scale</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Popover Section */}
              <ComponentSection
                id="popover"
                title="Popover"
                description="Popovers display additional content in a floating container when triggered. They can contain rich content and interactive elements."
              >
                <ComponentDemo title="Interactive Example">
                  <Popover
                    visible={popoverVisible}
                    side="bottom-center"
                    showBadge={true}
                    showStep={true}
                    showTrailingButton={true}
                    badge="New"
                    step="1 / 2"
                    trailingButtonText="Got it"
                    onTrailingButtonClick={() => setPopoverVisible(false)}
                    content={
                      <div>
                        <p className="font-semibold mb-2">From trees to seeds</p>
                        <p className="text-sm">Our mission is growing. Seeds now symbolize the broader impact we're making together, not just planting trees, but driving lasting change for t...</p>
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
                </ComponentDemo>

                <ComponentDemo title="Positions">
                  <div className="flex flex-wrap gap-4 items-center">
                    <Popover
                      visible={false}
                      side="top-center"
                      showBadge={true}
                      showTrailingButton={true}
                      content={<p>Top center popover</p>}
                    >
                      <Button variant="outline">Top Center</Button>
                    </Popover>
                    <Popover
                      visible={false}
                      side="right-center"
                      showStep={true}
                      content={<p>Right center popover</p>}
                    >
                      <Button variant="outline">Right Center</Button>
                    </Popover>
                    <Popover
                      visible={false}
                      side="bottom-left"
                      showBadge={true}
                      content={<p>Bottom left popover</p>}
                    >
                      <Button variant="outline">Bottom Left</Button>
                    </Popover>
                    <Popover
                      visible={false}
                      side="left-center"
                      content={<p>Left center popover</p>}
                    >
                      <Button variant="outline">Left Center</Button>
                    </Popover>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Container: Background uses --background-neutral-featured color</p>
                      <p>• Badge: Optional "New" badge at the top (showBadge prop)</p>
                      <p>• Image: Optional image slot (showImage + imageUrl props)</p>
                      <p>• Body: Main content area with flexible slot</p>
                      <p>• Footer: Contains step counter and trailing button</p>
                      <p>• Step: Optional step indicator like "1 / 2" (showStep prop)</p>
                      <p>• Trailing Button: Optional action button (showTrailingButton prop)</p>
                      <p>• Arrow: Optional pointer (showPointer prop, default: true)</p>
                      <p>• Positions: 12 positions supported (top-left/center/right, bottom-left/center/right, left-top/center/bottom, right-top/center/bottom)</p>
                      <p>• Colors: #D7EB80 (light mode), #424A1E (dark mode)</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Slider Section */}
              <ComponentSection
                id="slider"
                title="Slider"
                description="Sliders showcase content in a carousel format, allowing users to browse through multiple items with smooth transitions."
              >
                <ComponentDemo title="Interactive Example">
                  <Slider slides={sliderData} />
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Slide container: Full width, aspect ratio preserved</p>
                      <p>• Navigation buttons: Previous/Next positioned on sides</p>
                      <p>• Indicators: Dots showing current slide position</p>
                      <p>• Content overlay: Title and description over image</p>
                      <p>• Transitions: Smooth slide animations</p>
                      <p>• Touch support: Swipe gestures on mobile</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Accordion Section */}
              <ComponentSection
                id="accordion"
                title="Accordion"
                description="Accordions allow users to expand and collapse sections of content. They help organize information into manageable sections."
              >
                <ComponentDemo title="Interactive Example">
                  <Accordion defaultOpenIndex={0}>
                    <AccordionItem index={0} title="First Item">
                      Content for first item. This section can contain any type of content including text, images, or other components.
                    </AccordionItem>
                    <AccordionItem index={1} title="Second Item">
                      Content for second item. Each accordion item expands and collapses independently.
                    </AccordionItem>
                    <AccordionItem index={2} title="Third Item">
                      Content for third item. Only one item can be open at a time by default.
                    </AccordionItem>
                  </Accordion>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Header: Clickable trigger with title</p>
                      <p>• Header padding: 16px vertical, full width</p>
                      <p>• Content panel: Collapsible area with 16px padding</p>
                      <p>• Divider: 1px border between items</p>
                      <p>• Animation: Max-height transition for smooth expand/collapse</p>
                      <p>• Single expansion: Only one item open at a time</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
