import { cn } from "@/lib/utils";

type RadioSize = "s" | "m" | "l";

interface EcosiaRadioProps {
  id: string;
  name: string;
  value: string;
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: RadioSize;
  reversed?: boolean;
}

const sizeClasses = {
  s: "w-4 h-4",
  m: "w-5 h-5",
  l: "w-6 h-6",
};

export function EcosiaRadio({
  id,
  name,
  value,
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  size = "m",
  reversed = false,
}: EcosiaRadioProps) {
  return (
    <div className="flex items-start gap-2">
      <div className={cn("flex items-start", reversed && "order-1")}>
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            "appearance-none rounded-full border-2 border-[hsl(var(--form-border-default))]",
            "transition-all duration-200 cursor-pointer",
            "hover:border-[hsl(var(--form-border-hover))]",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "checked:border-[6px] checked:border-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            sizeClasses[size]
          )}
        />
      </div>
      <label
        htmlFor={id}
        className={cn(
          "flex-1 cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          reversed && "order-0"
        )}
      >
        <div className="text-sm font-medium text-foreground">{label}</div>
        {description && (
          <div className="text-sm text-muted-foreground mt-1">{description}</div>
        )}
      </label>
    </div>
  );
}
