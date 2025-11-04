import { Button, type ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

export const GhostButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  (props, ref) => {
    return <Button ref={ref} variant="ghost" {...props} />;
  }
);

GhostButton.displayName = "GhostButton";
