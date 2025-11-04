import { Button, type ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

export const LinkButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  (props, ref) => {
    return <Button ref={ref} variant="link" {...props} />;
  }
);

LinkButton.displayName = "LinkButton";
