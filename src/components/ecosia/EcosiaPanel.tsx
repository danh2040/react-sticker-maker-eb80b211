import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface EcosiaPanelProps {
  open: boolean;
  onClose?: () => void;
  side?: "left" | "right";
  showBackdrop?: boolean;
  children: React.ReactNode;
}

export function EcosiaPanel({
  open,
  onClose,
  side = "left",
  showBackdrop = true,
  children,
}: EcosiaPanelProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && onClose) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      {showBackdrop && (
        <div
          className={cn(
            "fixed inset-0 bg-[hsl(var(--overlay-primary))] transition-opacity duration-s ease-in-out z-40",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 h-full w-[250px] bg-[hsl(var(--background-elevation-1))] shadow-elevation-2 transition-transform duration-s ease-in-out z-50 overflow-y-auto overflow-x-hidden",
          side === "left" ? "left-0" : "right-0",
          open
            ? "translate-x-0"
            : side === "left"
            ? "-translate-x-full"
            : "translate-x-full"
        )}
      >
        {children}
      </div>
    </>
  );
}
