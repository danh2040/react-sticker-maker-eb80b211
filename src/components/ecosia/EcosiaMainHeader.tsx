import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EcosiaMainNav } from "./EcosiaMainNav";

interface EcosiaMainHeaderProps {
  logo: React.ReactNode;
  showSearch?: boolean;
  showSignUp?: boolean;
  showInstall?: boolean;
  sticky?: boolean;
  compact?: boolean;
  rounded?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

export function EcosiaMainHeader({
  logo,
  showSearch = true,
  showSignUp = true,
  showInstall = false,
  sticky = false,
  compact = false,
  rounded = false,
  onSearch,
  className,
}: EcosiaMainHeaderProps) {
  const navGroups = [
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
  ];

  const footerLinks = [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Help", href: "#" },
  ];

  return (
    <header
      className={cn(
        "w-full bg-background border-b border-border transition-all duration-300",
        sticky && "sticky top-0 z-40 backdrop-blur-sm",
        rounded && "rounded-full mx-4 mt-4 border",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-4",
          "px-4 md:px-8 py-3",
          compact && "py-2"
        )}
      >
        {/* Logo */}
        <div className="flex-shrink-0">{logo}</div>

        {/* Search (if not compact) */}
        {!compact && showSearch && (
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get("search") as string;
                onSearch?.(query);
              }}
              className="relative"
            >
              <Input
                name="search"
                type="search"
                placeholder="Search the web..."
                className="pr-10 rounded-full"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {showInstall && (
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              Install
            </Button>
          )}
          {showSignUp && (
            <Button size="sm" className="hidden md:inline-flex rounded-full">
              Sign Up
            </Button>
          )}
          <EcosiaMainNav
            groups={navGroups}
            footerLinks={footerLinks}
            isMobile={false}
          />
        </div>
      </div>

      {/* Mobile Search */}
      {!compact && showSearch && (
        <div className="px-4 pb-3 md:hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get("search") as string;
              onSearch?.(query);
            }}
            className="relative"
          >
            <Input
              name="search"
              type="search"
              placeholder="Search the web..."
              className="pr-10 rounded-full"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </header>
  );
}
