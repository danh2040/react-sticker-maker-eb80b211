import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-m font-semibold ring-offset-background transition-all duration-2s focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--color-button-background-primary))] text-[hsl(var(--color-button-content-primary))] hover:bg-[hsl(var(--color-button-background-primary-hover))] active:bg-[hsl(var(--color-button-background-primary-active))]",
        primary: "bg-[hsl(var(--color-button-background-primary))] text-[hsl(var(--color-button-content-primary))] hover:bg-[hsl(var(--color-button-background-primary-hover))] active:bg-[hsl(var(--color-button-background-primary-active))]",
        destructive: "bg-[hsl(var(--color-button-background-negative))] text-[hsl(var(--color-button-content-primary))] hover:bg-[hsl(var(--color-button-background-negative-hover))] active:bg-[hsl(var(--color-button-background-negative-active))]",
        outline: "border-2 border-[hsl(var(--form-border-default))] bg-transparent text-foreground hover:bg-[hsl(var(--color-highlight-primary))] hover:border-[hsl(var(--form-border-hover))] active:border-[hsl(var(--form-border-primary-active))] active:bg-[hsl(var(--color-button-background-transparent-active))]",
        secondary: "bg-[hsl(var(--color-button-background-secondary))] text-[hsl(var(--color-button-content-secondary))] hover:bg-[hsl(var(--color-button-background-secondary-hover))] active:bg-[hsl(var(--color-button-background-secondary-active))]",
        ghost: "hover:bg-[hsl(var(--color-highlight-primary))] active:bg-[hsl(var(--color-button-background-transparent-active))] text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        featured: "bg-[hsl(var(--color-button-background-featured))] text-[hsl(var(--color-button-content-featured))] hover:bg-[hsl(var(--color-button-background-featured-hover))] active:bg-[hsl(var(--color-button-background-featured-active))]",
      },
      size: {
        default: "h-10 px-m py-2",
        sm: "h-9 px-s py-1",
        lg: "h-11 px-1l py-2",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  iconOnly?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, iconLeft, iconRight, iconOnly, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // When asChild is true, Slot expects exactly one child - don't apply icon logic
    if (asChild) {
      return (
        <Comp 
          className={cn(buttonVariants({ variant, size, className }))} 
          ref={ref} 
          {...props}
        >
          {children}
        </Comp>
      );
    }
    
    // Normal button rendering with icon support
    const showText = !iconOnly && !!children;
    const isIconOnly = iconOnly || (!children && (!!iconLeft || !!iconRight));
    
    return (
      <Comp 
        className={cn(
          buttonVariants({ variant, size, className }), 
          isIconOnly && "p-0 aspect-square"
        )} 
        ref={ref} 
        {...props}
      >
        {iconLeft && showText && <span className="flex items-center">{iconLeft}</span>}
        {iconLeft && isIconOnly && !iconRight && iconLeft}
        {showText && children}
        {iconRight && showText && <span className="flex items-center">{iconRight}</span>}
        {iconRight && isIconOnly && !iconLeft && iconRight}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
