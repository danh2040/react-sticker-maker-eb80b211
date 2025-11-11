import { Badge, AdPill, Accordion, AccordionItem, Avatar, Switch, Tooltip, Slider, Popover, Button } from "@/components/ecosia";
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ComponentSection } from "@/components/ComponentSection";
import { ComponentDemo } from "@/components/ComponentDemo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, TreePine, DollarSign } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import ecosiaLogoDark from "@/assets/ecosia-logo-dark.svg";
import ecosiaLogoLight from "@/assets/ecosia-logo-light.svg";
import ecosiaLogoBrowserDark from "@/assets/ecosia-logo-browser-dark.svg";
import ecosiaLogoBrowserLight from "@/assets/ecosia-logo-browser-light.svg";
import ecosiaFaviconApp from "@/assets/ecosia-favicon-app.svg";
import ecosiaFaviconRounded from "@/assets/ecosia-favicon-rounded.svg";
import { EcosiaToast } from "@/components/ecosia/EcosiaToast";
import { EcosiaSheet } from "@/components/ecosia/EcosiaSheet";
import { EcosiaRadio } from "@/components/ecosia/EcosiaRadio";
import { EcosiaRadios } from "@/components/ecosia/EcosiaRadios";
import { EcosiaPanel } from "@/components/ecosia/EcosiaPanel";
import { EcosiaCheckbox } from "@/components/ecosia/EcosiaCheckbox";
import { EcosiaIcon } from "@/components/ecosia/EcosiaIcon";
import { EcosiaCounter } from "@/components/ecosia/EcosiaCounter";
import { EcosiaGlobalCounter } from "@/components/ecosia/EcosiaGlobalCounter";
import { EcosiaAISearchButton } from "@/components/ecosia/EcosiaAISearchButton";
import { EcosiaMainNav } from "@/components/ecosia/EcosiaMainNav";
import { EcosiaMainHeader } from "@/components/ecosia/EcosiaMainHeader";
import { EcosiaMainFooter } from "@/components/ecosia/EcosiaMainFooter";
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
import safety from "@/assets/illustrations/safety.svg";
import seedlingsPlanted from "@/assets/illustrations/seedlings_planted.svg";
import socialProof from "@/assets/illustrations/social_proof.svg";
import transparency from "@/assets/illustrations/transparency.svg";
import typeFlower from "@/assets/photography/Type_Flower.png";
import typeForest from "@/assets/photography/Type_Forest.png";
import typeFungus from "@/assets/photography/Type_Fungus.png";
import typeLeaf from "@/assets/photography/Type_Leaf.png";
import typeMountains from "@/assets/photography/Type_Mountains.png";
import typeSoil from "@/assets/photography/Type_Soil.png";
import typeWood from "@/assets/photography/Type_Wood.png";
import typeIndia from "@/assets/photography/Type_India.png";
import typeUganda from "@/assets/photography/Type_Uganda.png";
import typeSenegal from "@/assets/photography/Type_Senegal.png";
import typeSpain from "@/assets/photography/Type_Spain.png";
import typeKenya3 from "@/assets/photography/Type_Kenya-3.png";
import typeKenya2 from "@/assets/photography/Type_Kenya-2.png";
import typeKenya1 from "@/assets/photography/Type_Kenya-1.png";
import typeMadagascar4 from "@/assets/photography/Type_Madagascar-4.png";
import typeMadagascar3 from "@/assets/photography/Type_Madagascar-3.png";
import typeMadagascar2 from "@/assets/photography/Type_Madagascar-2.png";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Index = () => {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [panelSide, setPanelSide] = useState<"left" | "right">("left");
  const [radioValue, setRadioValue] = useState("option1");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  
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
                <ComponentDemo title={
                  <div className="flex items-center gap-2">
                    Variants
                    <Badge variant="featured">new</Badge>
                  </div>
                }>
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

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={safety} alt="Safety" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Safety</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={seedlingsPlanted} alt="Seedlings Planted" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Seedlings Planted</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={socialProof} alt="Social Proof" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Social Proof</p>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-card">
                        <img src={transparency} alt="Transparency" className="h-20 w-20" />
                        <p className="text-sm text-muted-foreground text-center">Transparency</p>
                      </div>
                    </div>
                  </ComponentDemo>
              </ComponentSection>

              {/* Photography Section */}
              <ComponentSection
                id="photography"
                title="Photography"
                description="Abstract nature photography assets that adapt to different sizes and aspect ratios"
              >
                <ComponentDemo title="Abstract Nature Variants">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeFlower} 
                          alt="Flower" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Flower</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeForest} 
                          alt="Forest" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Forest</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeFungus} 
                          alt="Fungus" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Fungus</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeLeaf} 
                          alt="Leaf" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Leaf</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeMountains} 
                          alt="Mountains" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Mountains</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeSoil} 
                          alt="Soil" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Soil</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeWood} 
                          alt="Wood" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Wood</p>
                    </div>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Ecosia Projects Variants">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeIndia} 
                          alt="India Project" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">India</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeUganda} 
                          alt="Uganda Project" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Uganda</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeSenegal} 
                          alt="Senegal Project" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Senegal</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeSpain} 
                          alt="Spain Project" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Spain</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeKenya3} 
                          alt="Kenya Project 3" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Kenya 3</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeKenya2} 
                          alt="Kenya Project 2" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Kenya 2</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeKenya1} 
                          alt="Kenya Project 1" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Kenya 1</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeMadagascar4} 
                          alt="Madagascar Project 4" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Madagascar 4</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeMadagascar3} 
                          alt="Madagascar Project 3" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Madagascar 3</p>
                    </div>

                    <div className="space-y-3">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={typeMadagascar2} 
                          alt="Madagascar Project 2" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground text-center">Madagascar 2</p>
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

              {/* Toast Section */}
              <ComponentSection
                id="toast"
                title="Toast"
                description="Toast notifications provide brief, non-intrusive feedback messages to users. They appear temporarily and automatically dismiss."
              >
                <ComponentDemo title="Interactive Example">
                  <div className="space-y-4">
                    <Button onClick={() => setShowToast(true)}>Show Toast</Button>
                    {showToast && (
                      <EcosiaToast
                        variant="positive"
                        message="Action completed successfully!"
                        onClose={() => setShowToast(false)}
                      />
                    )}
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Variants">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Neutral</h4>
                      <div className="relative h-16">
                        <EcosiaToast variant="neutral" message="This is a neutral toast message" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Informative</h4>
                      <div className="relative h-16">
                        <EcosiaToast variant="informative" message="This is an informative message" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Positive</h4>
                      <div className="relative h-16">
                        <EcosiaToast variant="positive" message="Action completed successfully!" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Negative</h4>
                      <div className="relative h-16">
                        <EcosiaToast variant="negative" message="An error occurred" />
                      </div>
                    </div>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Max width: 500px on tablet and desktop</p>
                      <p>• Padding: 16px horizontal, 12px vertical</p>
                      <p>• Border radius: 8px (rounded-lg)</p>
                      <p>• Shadow: Large elevation shadow</p>
                      <p>• Backdrop blur effect for depth</p>
                      <p>• Icon: 20px (optional based on variant)</p>
                      <p>• Close button: 16px icon with hover state</p>
                      <p>• Position: Bottom center or bottom right</p>
                      <p>• Animation: Slide up from bottom with fade</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Sheet Section */}
              <ComponentSection
                id="sheet"
                title="Sheet"
                description="Sheet is a full-screen overlay modal, primarily used on mobile devices. It provides a focused context for user interactions."
              >
                <ComponentDemo title="Interactive Example">
                  <div className="space-y-4">
                    <Button onClick={() => setShowSheet(true)}>Open Sheet</Button>
                    <EcosiaSheet
                      open={showSheet}
                      onClose={() => setShowSheet(false)}
                      ariaLabel="Example sheet"
                    >
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Sheet Title</h2>
                        <p className="text-muted-foreground">
                          This is a full-screen sheet that overlays the entire viewport. It's perfect for mobile
                          navigation menus, forms, or detailed content that needs full attention.
                        </p>
                        <div className="space-y-2">
                          <Button className="w-full">Primary Action</Button>
                          <Button variant="outline" className="w-full" onClick={() => setShowSheet(false)}>
                            Close
                          </Button>
                        </div>
                      </div>
                    </EcosiaSheet>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Full viewport coverage (100vh, 100vw)</p>
                      <p>• Close button: Top right, 8px padding</p>
                      <p>• Content padding: 24px with top padding of 64px to clear close button</p>
                      <p>• Z-index: 50 (highest layer)</p>
                      <p>• Background: Uses semantic background color</p>
                      <p>• Scroll: Vertical overflow enabled, horizontal hidden</p>
                      <p>• Focus trap: Traps keyboard focus within sheet</p>
                      <p>• Escape key: Closes the sheet</p>
                      <p>• Animation: Fade in transition</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Radios Section */}
              <ComponentSection
                id="radios"
                title="Radios"
                description="Radio buttons allow users to select a single option from a group of mutually exclusive choices. Supports different sizes and layouts."
              >
                <ComponentDemo title="Interactive Example">
                  <EcosiaRadios
                    name="example"
                    options={[
                      { label: "Option 1", value: "option1", description: "First choice" },
                      { label: "Option 2", value: "option2", description: "Second choice" },
                      { label: "Option 3", value: "option3", description: "Third choice" },
                    ]}
                    value={radioValue}
                    onChange={setRadioValue}
                  />
                </ComponentDemo>

                <ComponentDemo title="Variants">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Small Size</h4>
                      <EcosiaRadios
                        name="small"
                        options={["Small 1", "Small 2", "Small 3"]}
                        size="s"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Medium Size (Default)</h4>
                      <EcosiaRadios
                        name="medium"
                        options={["Medium 1", "Medium 2", "Medium 3"]}
                        size="m"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Large Size</h4>
                      <EcosiaRadios
                        name="large"
                        options={["Large 1", "Large 2", "Large 3"]}
                        size="l"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Reversed Order</h4>
                      <EcosiaRadios
                        name="reversed"
                        options={["Reversed 1", "Reversed 2"]}
                        reversed
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Disabled</h4>
                      <EcosiaRadios
                        name="disabled"
                        options={["Disabled 1", "Disabled 2"]}
                        disabled
                      />
                    </div>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Radio button sizes: s (16px), m (20px), l (24px)</p>
                      <p>• Border: 2px solid with semantic form border color</p>
                      <p>• Checked state: 6px border width with primary color</p>
                      <p>• Label spacing: 8px gap between radio and label</p>
                      <p>• Group spacing: 12px gap between radio items</p>
                      <p>• Focus ring: 2px offset with primary color</p>
                      <p>• Hover: Border color changes to hover state</p>
                      <p>• Transition: 200ms for border color changes</p>
                      <p>• Description: Muted foreground color, 14px font</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Panel Section */}
              <ComponentSection
                id="panel"
                title="Panel"
                description="Panel is a sliding side drawer that appears from the left or right edge. It's useful for navigation menus or additional content."
              >
                <ComponentDemo title="Interactive Example">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button onClick={() => { setPanelSide("left"); setShowPanel(true); }}>
                        Open Left Panel
                      </Button>
                      <Button onClick={() => { setPanelSide("right"); setShowPanel(true); }}>
                        Open Right Panel
                      </Button>
                    </div>
                    <EcosiaPanel
                      open={showPanel}
                      onClose={() => setShowPanel(false)}
                      side={panelSide}
                      showBackdrop={true}
                    >
                      <div className="p-6 space-y-4">
                        <h3 className="text-lg font-bold">Panel Content</h3>
                        <p className="text-sm text-muted-foreground">
                          This is a {panelSide} sliding panel. Click outside or press Escape to close.
                        </p>
                        <nav className="space-y-2">
                          <a href="#" className="block p-2 hover:bg-muted rounded-md">Menu Item 1</a>
                          <a href="#" className="block p-2 hover:bg-muted rounded-md">Menu Item 2</a>
                          <a href="#" className="block p-2 hover:bg-muted rounded-md">Menu Item 3</a>
                        </nav>
                      </div>
                    </EcosiaPanel>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Width: 250px fixed</p>
                      <p>• Height: 100vh (full height)</p>
                      <p>• Z-index: 50 for panel, 40 for backdrop</p>
                      <p>• Backdrop: Semi-transparent overlay with blur</p>
                      <p>• Transition: 300ms slide and opacity transitions</p>
                      <p>• Shadow: Elevation shadow for depth</p>
                      <p>• Scroll: Vertical overflow enabled</p>
                      <p>• Position: Fixed to left or right edge</p>
                      <p>• Escape key: Closes the panel</p>
                      <p>• Click away: Closes when clicking backdrop</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Main Nav Section */}
              <ComponentSection
                id="main-nav"
                title="Main Nav"
                description="Main navigation menu with hamburger toggle. Displays as dropdown on desktop and full-screen sheet on mobile."
              >
                <ComponentDemo title="Interactive Example">
                  <EcosiaMainNav
                    groups={[
                      {
                        title: "Products",
                        links: [
                          { label: "Search", href: "#" },
                          { label: "Browser", href: "#" },
                          { label: "Mobile App", href: "#" },
                        ],
                      },
                      {
                        title: "About",
                        links: [
                          { label: "Our Mission", href: "#" },
                          { label: "Financial Reports", href: "#" },
                          { label: "Blog", href: "#" },
                        ],
                      },
                    ]}
                    footerLinks={[
                      { label: "Privacy", href: "#" },
                      { label: "Terms", href: "#" },
                      { label: "Help", href: "#" },
                    ]}
                  />
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Menu button: Hamburger icon with hover state</p>
                      <p>• Desktop dropdown: Max width 448px, max height 75vh</p>
                      <p>• Mobile: Full-screen sheet overlay</p>
                      <p>• Menu groups: Organized by category with headers</p>
                      <p>• Group spacing: 24px margin between groups</p>
                      <p>• Link padding: 8px vertical, 16px horizontal</p>
                      <p>• Border radius: 20px for dropdown</p>
                      <p>• Shadow: Elevation shadow for dropdown</p>
                      <p>• Focus management: Escape key closes menu</p>
                      <p>• Click away: Closes when clicking outside</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Main Header Section */}
              <ComponentSection
                id="main-header"
                title="Main Header"
                description="Complete header component with logo, search, navigation, and action buttons. Fully responsive with sticky option."
              >
                <ComponentDemo title="Interactive Example">
                  <EcosiaMainHeader
                    logo={
                      <img
                        src={ecosiaLogoLight}
                        alt="Ecosia"
                        className="h-5 w-auto dark:hidden"
                      />
                    }
                    showSearch={true}
                    showSignUp={true}
                    sticky={false}
                  />
                </ComponentDemo>

                <ComponentDemo title="Variants">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Compact (No Search)</h4>
                      <EcosiaMainHeader
                        logo={<img src={ecosiaLogoLight} alt="Ecosia" className="h-5 w-auto dark:hidden" />}
                        showSearch={false}
                        compact={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Rounded</h4>
                      <EcosiaMainHeader
                        logo={<img src={ecosiaLogoLight} alt="Ecosia" className="h-5 w-auto dark:hidden" />}
                        showSearch={false}
                        rounded={true}
                      />
                    </div>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Logo: 70px width, 20px height</p>
                      <p>• Mobile padding: 16px</p>
                      <p>• Desktop padding: 32px horizontal</p>
                      <p>• Search: Max width 768px, centered on desktop</p>
                      <p>• Search height: 48px with rounded full border</p>
                      <p>• Sticky: Backdrop blur with border bottom</p>
                      <p>• Responsive: Stacked on mobile, horizontal on desktop</p>
                      <p>• Z-index: 40 when sticky</p>
                      <p>• Transition: Background and shadow on scroll</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Main Footer Section */}
              <ComponentSection
                id="main-footer"
                title="Main Footer"
                description="Complete footer with support links, social media icons, and optional visual section. Fully responsive design."
              >
                <ComponentDemo title="Interactive Example">
                  <EcosiaMainFooter
                    supportLinks={[
                      { label: "About Us", href: "#" },
                      { label: "Blog", href: "#" },
                      { label: "Privacy", href: "#" },
                      { label: "Terms", href: "#" },
                      { label: "Help", href: "#" },
                    ]}
                    showSettings={true}
                    onCookiePreferences={() => alert("Cookie preferences")}
                  />
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Background: Quaternary background color</p>
                      <p>• Text color: Secondary text color</p>
                      <p>• Mobile padding: 32px vertical, 32px horizontal</p>
                      <p>• Desktop padding: 32px vertical, 64px horizontal</p>
                      <p>• Social icons: 30px on mobile, 24px on desktop</p>
                      <p>• Link spacing: 16px gap between links</p>
                      <p>• Responsive: Stacked center on mobile, horizontal on desktop</p>
                      <p>• Transitions: Color transitions on hover (200ms)</p>
                      <p>• Visual section: Optional image/tree section above footer</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Icons Section */}
              <ComponentSection
                id="icons"
                title="Icons"
                description="Dynamic icon component with multiple sizes. Maps to Lucide React icons with consistent sizing and styling."
              >
                <ComponentDemo title="Interactive Example">
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                    {["check-circle", "info-circle", "problem", "close", "search", "menu", "home", "settings", "user", "heart", "star", "spinner"].map((icon) => (
                      <div key={icon} className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                        <EcosiaIcon name={icon} size="m" />
                        <span className="text-xs text-center">{icon}</span>
                      </div>
                    ))}
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Variants">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Small (16px)</h4>
                      <div className="flex gap-4">
                        <EcosiaIcon name="check-circle" size="s" />
                        <EcosiaIcon name="info-circle" size="s" />
                        <EcosiaIcon name="problem" size="s" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Medium (20px)</h4>
                      <div className="flex gap-4">
                        <EcosiaIcon name="check-circle" size="m" />
                        <EcosiaIcon name="info-circle" size="m" />
                        <EcosiaIcon name="problem" size="m" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Large (24px)</h4>
                      <div className="flex gap-4">
                        <EcosiaIcon name="check-circle" size="l" />
                        <EcosiaIcon name="info-circle" size="l" />
                        <EcosiaIcon name="problem" size="l" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Animated (Spinner)</h4>
                      <EcosiaIcon name="spinner" size="m" spinning />
                    </div>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Small size: 16px (w-4 h-4)</p>
                      <p>• Medium size: 20px (w-5 h-5)</p>
                      <p>• Large size: 24px (w-6 h-6)</p>
                      <p>• Vertical align: Middle</p>
                      <p>• Color: Inherits from parent (currentColor)</p>
                      <p>• Spinner animation: 0.9s linear infinite rotation</p>
                      <p>• Check animation: Stroke dash animation 0.5s ease-out</p>
                      <p>• Icon mapping: Maps Ecosia names to Lucide icons</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Counters Section */}
              <ComponentSection
                id="counters"
                title="Counters"
                description="Counter components for displaying metrics and statistics. Includes single counter and global counter (two counters side-by-side)."
              >
                <ComponentDemo title="Interactive Example">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Single Counter</h4>
                      <EcosiaCounter
                        icon={<TreePine className="w-8 h-8 text-green-500" />}
                        count="200,000,000+"
                        description="Trees planted"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Global Counter</h4>
                      <EcosiaGlobalCounter
                        treeCount="200M+"
                        investmentCount="€50M+"
                        treeIcon={<TreePine className="w-8 h-8 text-green-500" />}
                        moneyIcon={<DollarSign className="w-8 h-8 text-yellow-500" />}
                      />
                    </div>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Variants">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Glass Effect</h4>
                      <EcosiaGlobalCounter
                        treeCount="200M+"
                        investmentCount="€50M+"
                        treeIcon={<TreePine className="w-8 h-8 text-green-500" />}
                        moneyIcon={<DollarSign className="w-8 h-8 text-yellow-500" />}
                        glass={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">With Border</h4>
                      <EcosiaGlobalCounter
                        treeCount="200M+"
                        investmentCount="€50M+"
                        treeIcon={<TreePine className="w-8 h-8 text-green-500" />}
                        moneyIcon={<DollarSign className="w-8 h-8 text-yellow-500" />}
                        border={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Vertical Layout</h4>
                      <EcosiaGlobalCounter
                        treeCount="200M+"
                        investmentCount="€50M+"
                        treeIcon={<TreePine className="w-8 h-8 text-green-500" />}
                        moneyIcon={<DollarSign className="w-8 h-8 text-yellow-500" />}
                        vertical={true}
                      />
                    </div>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Counter padding: 16px</p>
                      <p>• Min height: 69px on tablet+</p>
                      <p>• Count font: 20px, weight 700</p>
                      <p>• Description font: 14px, muted foreground</p>
                      <p>• Icon sizes: s (24px), m (32px), l (40px)</p>
                      <p>• Grid layout: CSS Grid with named areas</p>
                      <p>• Border radius: 16px (rounded-2xl)</p>
                      <p>• Global counter: Two counters with divider</p>
                      <p>• Divider: Horizontal on mobile, vertical on tablet+</p>
                      <p>• Glass effect: Backdrop filter blur 24px</p>
                      <p>• Border: 1px solid decorative border color</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* Checkbox Section */}
              <ComponentSection
                id="checkbox"
                title="Checkbox"
                description="Checkbox component for binary choices. Supports checked, unchecked, and disabled states with keyboard accessibility."
              >
                <ComponentDemo title="Interactive Example">
                  <div className="space-y-4">
                    <EcosiaCheckbox
                      id="interactive-checkbox"
                      label="Accept terms and conditions"
                      checked={checkboxChecked}
                      onChange={setCheckboxChecked}
                    />
                    <p className="text-sm text-muted-foreground">
                      Checkbox is {checkboxChecked ? "checked" : "unchecked"}
                    </p>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Variants">
                  <div className="space-y-4">
                    <EcosiaCheckbox id="unchecked" label="Unchecked" checked={false} />
                    <EcosiaCheckbox id="checked" label="Checked" checked={true} />
                    <EcosiaCheckbox id="disabled-unchecked" label="Disabled Unchecked" checked={false} disabled />
                    <EcosiaCheckbox id="disabled-checked" label="Disabled Checked" checked={true} disabled />
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Checkbox size: 24px (w-6 h-6)</p>
                      <p>• Border: 2px solid with form border color</p>
                      <p>• Border radius: 4px (rounded-sm)</p>
                      <p>• Checked: Primary background with white check icon</p>
                      <p>• Check icon: 16px with stroke width 3</p>
                      <p>• Focus ring: 2px offset with primary color</p>
                      <p>• Tappable area: Extends 4px beyond visual box</p>
                      <p>• Label spacing: 8px gap from checkbox</p>
                      <p>• Transition: 200ms for border and background</p>
                      <p>• Disabled: Muted background with reduced opacity</p>
                      <p>• Keyboard: Space/Enter to toggle</p>
                    </div>
                  </div>
                </ComponentDemo>
              </ComponentSection>

              {/* AI Search Button Section */}
              <ComponentSection
                id="ai-search-button"
                title="AI Search Button"
                description="Specialized button for AI-powered search features. Shows icon with text on desktop, icon only with tooltip on mobile."
              >
                <ComponentDemo title="Interactive Example">
                  <div className="space-y-4">
                    <EcosiaAISearchButton onClick={() => alert("AI Search clicked!")} showText={true} />
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Variants">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Desktop (With Text)</h4>
                      <EcosiaAISearchButton showText={true} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Mobile (Icon Only with Tooltip)</h4>
                      <EcosiaAISearchButton showText={false} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">With Link</h4>
                      <EcosiaAISearchButton showText={true} href="/ai-search" />
                    </div>
                  </div>
                </ComponentDemo>

                <ComponentDemo title="Anatomy">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Button variant: Outline with white background</p>
                      <p>• Button size: Small (sm)</p>
                      <p>• Icon: Sparkles from Lucide React</p>
                      <p>• Icon size: 16px (h-4 w-4)</p>
                      <p>• Text visibility: Hidden on mobile, visible on desktop</p>
                      <p>• Text spacing: 8px margin left from icon</p>
                      <p>• Margin right: 4px for layout spacing</p>
                      <p>• Tooltip: Shows "AI Search" on mobile when text hidden</p>
                      <p>• Link support: Can render as anchor tag with href</p>
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
