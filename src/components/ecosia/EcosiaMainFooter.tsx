import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
}

interface EcosiaMainFooterProps {
  supportLinks?: FooterLink[];
  showVisual?: boolean;
  visualImage?: React.ReactNode;
  showSettings?: boolean;
  onCookiePreferences?: () => void;
  className?: string;
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export function EcosiaMainFooter({
  supportLinks = [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Help", href: "#" },
  ],
  showVisual = false,
  visualImage,
  showSettings = true,
  onCookiePreferences,
  className,
}: EcosiaMainFooterProps) {
  return (
    <footer className={cn("bg-[hsl(var(--background-quaternary))] text-[hsl(var(--text-secondary))]", className)}>
      {/* Visual Section */}
      {showVisual && visualImage && (
        <div className="py-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">{visualImage}</div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="px-8 md:px-16 py-12 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Support Links */}
            <nav className="flex flex-wrap justify-center md:justify-start gap-4 text-center md:text-left">
              {supportLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8 hover:text-foreground"
                  >
                    <a href={social.href} aria-label={social.label}>
                      <Icon className="h-5 w-5" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Cookie Preferences */}
          {showSettings && onCookiePreferences && (
            <div className="mt-6 text-center">
              <Button
                variant="link"
                size="sm"
                onClick={onCookiePreferences}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cookie Preferences
              </Button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
