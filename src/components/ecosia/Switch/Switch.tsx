import React from 'react';
import { Check } from 'lucide-react';
import './Switch.scss';

export interface SwitchProps {
  name: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  name,
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const classes = [
    'switch',
    `switch--${checked ? 'on' : 'off'}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="field field--type-checkbox">
        <div className="field__input-wrapper">
          <div className="field__details">
            <label htmlFor={name} className="field__label">
              {label}
            </label>
            {description && (
              <div className="field__description">{description}</div>
            )}
          </div>
          <label
            className={`field__input checkbox ${checked ? 'checkbox--checked' : ''}`}
            htmlFor={name}
          >
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={checked}
              onChange={handleChange}
              disabled={disabled}
              className="checkbox__input"
            />
            <span className="checkbox__icon">
              <Check className="checkbox__check" size={16} />
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

Switch.displayName = 'Switch';

