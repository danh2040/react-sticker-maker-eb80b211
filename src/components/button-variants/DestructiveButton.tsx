import { Button, type ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

export const DestructiveButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  (props, ref) => {
    return <Button ref={ref} variant="destructive" {...props} />;
  }
);

DestructiveButton.displayName = "DestructiveButton";
