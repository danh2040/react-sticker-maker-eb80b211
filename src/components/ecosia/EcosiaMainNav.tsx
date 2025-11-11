import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

interface NavGroup {
  title: string;
  links: NavLink[];
}

interface EcosiaMainNavProps {
  groups: NavGroup[];
  footerLinks?: NavLink[];
  isSignedIn?: boolean;
  onSignIn?: () => void;
  onSignOut?: () => void;
  isMobile?: boolean;
}

export function EcosiaMainNav({
  groups,
  footerLinks = [],
  isSignedIn = false,
  onSignIn,
  onSignOut,
  isMobile = false,
}: EcosiaMainNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <>
          {isMobile ? (
            <div className="fixed inset-0 z-50 bg-background animate-fade-in overflow-y-auto">
              <div className="flex justify-end p-4">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="px-6 pb-6">
                <NavContent
                  groups={groups}
                  footerLinks={footerLinks}
                  isSignedIn={isSignedIn}
                  onSignIn={onSignIn}
                  onSignOut={onSignOut}
                />
              </div>
            </div>
          ) : (
            <div className="absolute right-0 mt-1s w-screen max-w-md max-h-[75vh] overflow-y-auto bg-background border border-[hsl(var(--decorative-border-1))] rounded-2l shadow-elevation-2 z-50 animate-scale-in">
              <div className="p-m">
                <NavContent
                  groups={groups}
                  footerLinks={footerLinks}
                  isSignedIn={isSignedIn}
                  onSignIn={onSignIn}
                  onSignOut={onSignOut}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function NavContent({
  groups,
  footerLinks,
  isSignedIn,
  onSignIn,
  onSignOut,
}: Omit<EcosiaMainNavProps, "isMobile">) {
  return (
    <nav className="space-y-1l">
      {groups.map((group, index) => (
        <div key={index}>
          <h3 className="text-1s font-semibold uppercase tracking-wider text-muted-foreground mb-1s px-m">
            {group.title}
          </h3>
          <ul className="space-y-2s">
            {group.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <a
                  href={link.href}
                  className="block px-m py-1s rounded-l text-m hover:bg-[hsl(var(--color-highlight-primary))] transition-all duration-2s"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="pt-m border-t border-[hsl(var(--decorative-border-1))]">
        {isSignedIn ? (
          <Button variant="outline" onClick={onSignOut} className="w-full">
            Sign Out
          </Button>
        ) : (
          <Button onClick={onSignIn} className="w-full">
            Sign In
          </Button>
        )}
      </div>

      {footerLinks.length > 0 && (
        <div className="pt-m border-t border-[hsl(var(--decorative-border-1))]">
          <ul className="space-y-2s">
            {footerLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="block px-m py-1s text-s text-muted-foreground hover:text-foreground transition-all duration-2s"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
