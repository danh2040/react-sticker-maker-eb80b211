import { Button, type ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

export const SecondaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  (props, ref) => {
    return <Button ref={ref} variant="secondary" {...props} />;
  }
);

SecondaryButton.displayName = "SecondaryButton";
