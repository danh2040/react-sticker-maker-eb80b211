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
        "fixed bottom-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm",
        "max-w-[500px] w-full mx-auto animate-slide-in-bottom",
        alignRight ? "right-4 left-auto" : "left-1/2 -translate-x-1/2",
        config.className
      )}
    >
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
      <span className="flex-1 text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
