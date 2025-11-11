import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-[40px] w-full",
          "px-m py-s", // 16px horizontal, 12px vertical
          "text-l font-normal", // 16px font size
          "bg-background text-foreground",
          "placeholder:text-[hsl(var(--text-secondary))]",
          
          // Border
          "border border-solid border-[hsl(var(--form-border-default))]",
          "rounded-l", // 10px border radius (use rounded-full for search)
          
          // Transitions
          "transition-all duration-2s ease-in-out",
          
          // Hover state
          "hover:border-[hsl(var(--form-border-hover))]",
          
          // Focus state
          "focus:outline-none",
          "focus:border-[hsl(var(--form-border-primary-active))]",
          "focus:ring-2 focus:ring-[hsl(var(--form-border-primary-active))]",
          "focus:ring-offset-2",
          
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          "disabled:bg-[hsl(var(--background-quaternary))]",
          
          // File input styling
          "file:border-0 file:bg-transparent",
          "file:text-sm file:font-medium file:text-foreground",
          
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
