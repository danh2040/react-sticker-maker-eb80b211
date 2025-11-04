import { Button, type ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

export const OutlineButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  (props, ref) => {
    return <Button ref={ref} variant="outline" {...props} />;
  }
);

OutlineButton.displayName = "OutlineButton";
