import { useState } from "react";
import { EcosiaRadio } from "./EcosiaRadio";

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
  reversed?: boolean;
  disabled?: boolean;
  small?: boolean;
}

export function EcosiaRadios({
  name,
  options,
  value,
  onChange,
  reversed = false,
  disabled = false,
  small = false,
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
          reversed={reversed}
          disabled={disabled}
          small={small}
        />
      ))}
    </div>
  );
}
