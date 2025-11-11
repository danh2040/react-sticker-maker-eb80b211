import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface EcosiaCheckboxProps {
  id: string;
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function EcosiaCheckbox({
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
}: EcosiaCheckboxProps) {
  return (
    <div className="flex items-center gap-1s">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <label
          htmlFor={id}
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-s border-2 cursor-pointer transition-all duration-1s",
            "border-[hsl(var(--form-border-default))]",
            "hover:border-[hsl(var(--form-border-hover))]",
            "peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2",
            "peer-checked:border-primary peer-checked:bg-primary",
            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:bg-[hsl(var(--color-disabled))]",
            // Extended tappable area
            "before:absolute before:inset-[-4px] before:content-['']"
          )}
        >
          {checked && <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />}
        </label>
      </div>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-m font-medium cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
