import { Badge, AdPill, Accordion, AccordionItem, Avatar, Switch, Tooltip, Slider, Popover, Button } from "@/components/ecosia";
import { useState } from "react";

const DemoProfile = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const activitySlides = [
    {
      title: "Recent Searches",
      description: "You've made 127 searches this month, planting 5 trees!",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop"
    },
    {
      title: "Impact Summary",
      description: "Your searches have contributed to 47 trees planted worldwide.",
      imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=400&fit=crop"
    },
    {
      title: "Monthly Goal",
      description: "Almost there! 23 more searches to reach your monthly goal.",
      imageUrl: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background-elevation-1 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar size="l" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-text-primary">John Doe</h1>
                <Badge variant="featured">Premium</Badge>
              </div>
              <p className="text-text-secondary">Member since 2023</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Tooltip content="Edit your profile" side="center-bottom">
              <Button variant="outline">Edit Profile</Button>
            </Tooltip>
            <Button variant="primary">Share</Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background-elevation-2 border border-decorative-border-1 rounded-lg p-6">
            <h3 className="text-text-secondary text-sm mb-2">Trees Planted</h3>
            <p className="text-3xl font-bold text-text-primary">47</p>
            <Badge variant="accent-yellow" className="mt-2">+12 this week</Badge>
          </div>
          <div className="bg-background-elevation-2 border border-decorative-border-1 rounded-lg p-6">
            <h3 className="text-text-secondary text-sm mb-2">Total Searches</h3>
            <p className="text-3xl font-bold text-text-primary">1,284</p>
            <Badge variant="neutral">Active</Badge>
          </div>
          <div className="bg-background-elevation-2 border border-decorative-border-1 rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="text-text-secondary text-sm mb-2">Sponsored Result</h3>
              <p className="text-sm text-text-primary">Learn more about eco products</p>
            </div>
            <AdPill />
          </div>
        </section>

        {/* Activity Slider */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Your Activity</h2>
          <Slider slides={activitySlides} />
        </section>

        {/* Settings Accordion */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Account Settings</h2>
          <Accordion defaultOpenIndex={0}>
            <AccordionItem index={0} title="Notifications">
              <div className="space-y-4">
                <Switch
                  name="notifications"
                  label="Email Notifications"
                  description="Receive updates about your impact and new features"
                  checked={notificationsEnabled}
                  onChange={setNotificationsEnabled}
                />
                <p className="text-sm text-text-secondary">
                  Status: {notificationsEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </AccordionItem>
            
            <AccordionItem index={1} title="Appearance">
              <div className="space-y-4">
                <Switch
                  name="dark-mode"
                  label="Dark Mode"
                  description="Switch to dark theme for comfortable browsing"
                  checked={darkModeEnabled}
                  onChange={setDarkModeEnabled}
                />
                <div className="flex gap-2 mt-4">
                  <Button variant="secondary" size="sm">Reset Theme</Button>
                  <Button variant="ghost" size="sm">Preview</Button>
                </div>
              </div>
            </AccordionItem>

            <AccordionItem index={2} title="Privacy & Security">
              <div className="space-y-3">
                <p className="text-sm text-text-primary">
                  Your privacy is important to us. We never sell your data or track your searches.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Download Data</Button>
                  <Popover
                    visible={popoverVisible}
                    side="center-top"
                    content={
                      <div>
                        <p className="font-semibold mb-2">Delete Account?</p>
                        <p className="text-sm mb-3">This action cannot be undone.</p>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => setPopoverVisible(false)}>
                            Cancel
                          </Button>
                          <Button variant="primary" size="sm">Confirm</Button>
                        </div>
                      </div>
                    }
                  >
                    <Button 
                      variant="ghost"
                      size="sm" 
                      onClick={() => setPopoverVisible(!popoverVisible)}
                    >
                      Delete Account
                    </Button>
                  </Popover>
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Team Members with Avatars */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Your Team</h2>
          <div className="flex items-center gap-4">
            <Tooltip content="Sarah Johnson - Admin" side="center-top">
              <Avatar size="m">SJ</Avatar>
            </Tooltip>
            <Tooltip content="Mike Chen - Member" side="center-top">
              <Avatar size="m">MC</Avatar>
            </Tooltip>
            <Tooltip content="Emily Davis - Member" side="center-top">
              <Avatar size="m">ED</Avatar>
            </Tooltip>
            <Tooltip content="Invite team members" side="center-top">
              <Button variant="outline" size="sm">+ Invite</Button>
            </Tooltip>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DemoProfile;
