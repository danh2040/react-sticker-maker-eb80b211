import { useState } from "react";
import { EcosiaRadio } from "./EcosiaRadio";

type RadioSize = "s" | "m" | "l";

interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

interface EcosiaRadiosProps {
  name: string;
  options: (string | RadioOption)[];
  value?: string;
  onChange?: (value: string) => void;
  size?: RadioSize;
  reversed?: boolean;
  disabled?: boolean;
}

export function EcosiaRadios({
  name,
  options,
  value,
  onChange,
  size = "m",
  reversed = false,
  disabled = false,
}: EcosiaRadiosProps) {
  const [internalValue, setInternalValue] = useState(value || "");

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  return (
    <div className="space-y-3">
      {normalizedOptions.map((option, index) => (
        <EcosiaRadio
          key={option.value}
          id={`${name}-${index}`}
          name={name}
          value={option.value}
          label={option.label}
          description={option.description}
          checked={internalValue === option.value}
          onChange={handleChange}
          size={size}
          reversed={reversed}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
