import { Button, type ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  (props, ref) => {
    return <Button ref={ref} variant="default" {...props} />;
  }
);

PrimaryButton.displayName = "PrimaryButton";
