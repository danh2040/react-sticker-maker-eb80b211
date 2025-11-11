import { X, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "neutral" | "informative" | "positive" | "negative";

interface EcosiaToastProps {
  variant?: ToastVariant;
  message: string;
  onClose?: () => void;
  alignRight?: boolean;
}

const variantConfig = {
  neutral: {
    icon: null,
    className: "bg-[hsl(var(--toast-neutral))] text-[hsl(var(--toast-neutral-foreground))]",
  },
  informative: {
    icon: Info,
    className: "bg-[hsl(var(--toast-informative))] text-[hsl(var(--toast-informative-foreground))]",
  },
  positive: {
    icon: CheckCircle,
    className: "bg-[hsl(var(--toast-positive))] text-[hsl(var(--toast-positive-foreground))]",
  },
  negative: {
    icon: AlertTriangle,
    className: "bg-[hsl(var(--toast-negative))] text-[hsl(var(--toast-negative-foreground))]",
  },
};

export function EcosiaToast({
  variant = "neutral",
  message,
  onClose,
  alignRight = false,
}: EcosiaToastProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      role="log"
      aria-live="polite"
      className={cn(
        "fixed bottom-0 left-0 z-50 w-full flex pointer-events-none animate-slide-in-bottom",
        alignRight ? "justify-end" : "justify-center"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1s rounded-l px-m py-s shadow-elevation-2 pointer-events-auto mb-m max-w-[500px] w-full",
          alignRight && "mr-m",
          config.className
        )}
      >
        {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
        <span className="flex-1 text-m font-medium">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-full p-1 hover:bg-black/10 transition-all duration-2s"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
