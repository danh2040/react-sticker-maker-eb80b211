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
      <div className="relative inline-block">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
        />
        <label
          htmlFor={id}
          className={cn(
            // Base styles - creates the checkbox box
            "block relative w-[20px] h-[20px] cursor-pointer",
            "before:content-[''] before:block before:box-border before:w-[20px] before:h-[20px]",
            "before:border before:border-solid before:border-[hsl(var(--form-border-default))]",
            "before:rounded-s before:bg-[hsl(var(--color-button-content-primary))]",
            "before:transition-all before:duration-2s before:ease-in-out",
            
            // Hover state
            "hover:before:border-[hsl(var(--form-border-hover))]",
            
            // Focus state
            "peer-focus:outline peer-focus:outline-2 peer-focus:outline-[hsl(var(--form-border-primary-active))] peer-focus:outline-offset-2",
            "peer-focus:before:border-[hsl(var(--form-border-primary-active))]",
            
            // Checked state - CRITICAL: border becomes 10px, NOT filled background
            "peer-checked:before:border-[10px] peer-checked:before:border-[hsl(var(--color-brand-primary))]",
            
            // Disabled state
            "peer-disabled:pointer-events-none peer-disabled:text-[hsl(var(--color-disabled))]",
            "peer-disabled:before:border-[hsl(var(--color-disabled))] peer-disabled:before:bg-[hsl(var(--color-background-secondary))]",
            
            // Disabled + checked state
            "peer-disabled:peer-checked:before:border-[hsl(var(--color-disabled))]",
          )}
        >
          {/* Check icon */}
          <div
            className={cn(
              "absolute top-[2px] left-[2px] pointer-events-none",
              // Hide when unchecked OR (disabled AND unchecked)
              !checked && "hidden",
              disabled && !checked && "hidden",
              // Show when checked (even if disabled)
              checked && "block"
            )}
          >
            <Check 
              className={cn(
                "w-4 h-4",
                "text-[hsl(var(--color-button-content-primary))]"
              )} 
              strokeWidth={3}
            />
          </div>
        </label>
      </div>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-m font-medium cursor-pointer select-none",
            "text-[hsl(var(--foreground))]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
