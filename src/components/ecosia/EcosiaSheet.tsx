import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface EcosiaSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
}

export function EcosiaSheet({ open, onClose, children, ariaLabel = "Sheet" }: EcosiaSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background overflow-x-hidden overflow-y-auto animate-fade-in"
      aria-label={ariaLabel}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-2 rounded-full hover:bg-muted transition-colors"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="p-6 pt-16">{children}</div>
    </div>
  );
}
