import { cn } from "@/lib/utils";

interface EcosiaRadioProps {
  id: string;
  name: string;
  value: string;
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
  reversed?: boolean;
  small?: boolean; // Only affects label size, not radio size
}

export function EcosiaRadio({
  id,
  name,
  value,
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  reversed = false,
  small = false,
}: EcosiaRadioProps) {
  return (
    <label
      className={cn(
        "flex items-center min-h-[48px] cursor-pointer touch-manipulation",
        reversed && "flex-row-reverse justify-between w-full",
        disabled && "cursor-not-allowed opacity-50",
        small && "min-h-[20px]"
      )}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          // Base - FIXED 20px size, never changes
          "appearance-none w-[20px] h-[20px] m-0 flex-none",
          "rounded-full border border-solid border-[hsl(var(--form-border-default))]",
          "cursor-pointer",
          "transition-all duration-2s ease-in-out",
          
          // Hover state
          "hover:border-[hsl(var(--form-border-hover))]",
          
          // Focus state - keyboard navigation
          "focus:outline focus:outline-2 focus:outline-[hsl(var(--form-border-primary-active))] focus:outline-offset-2",
          
          // Checked state - border becomes 7px
          "checked:border-[7px] checked:border-[hsl(var(--form-border-primary-active))]",
          
          // Disabled state
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      />
      <span
        className={cn(
          "flex-1",
          small ? "px-1s" : "px-s",
          reversed && "order-0"
        )}
      >
        <div className={cn(
          "font-medium text-foreground",
          small ? "text-m" : "text-l"
        )}>
          {label}
        </div>
        {description && (
          <div className={cn(
            "text-m text-muted-foreground mt-2s block"
          )}>
            {description}
          </div>
        )}
      </span>
    </label>
  );
}
