import React, { forwardRef, InputHTMLAttributes, ButtonHTMLAttributes, useState, useEffect } from 'react';
import { clsx, generateClasses } from '../utils/classes';
import { Icon, type IconSize } from '../icon';
import './Input.scss';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Render as button instead of input */
  asButton?: boolean;
  /** Input value */
  value?: string | number;
  /** Input name */
  name?: string;
  /** Input type */
  type?: string;
  /** Icon to display at end */
  icon?: string;
  /** Icon to display at start */
  iconStart?: string;
  /** Icon size */
  iconSize?: IconSize;
  /** Placeholder text */
  placeholder?: string;
  /** Required field */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Invalid state */
  invalid?: boolean;
  /** ARIA controls */
  ariaControls?: string;
  /** ARIA expanded */
  ariaExpanded?: string;
  /** ARIA label */
  ariaLabel?: string;
  /** Additional class name */
  className?: string;
  /** On change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** On click handler (for button mode) */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Input component with icon support
 */
export const Input = forwardRef<HTMLInputElement | HTMLButtonElement, InputProps>(
  (
    {
      asButton = false,
      value,
      name = '',
      type = 'text',
      icon,
      iconStart,
      iconSize = 'm',
      placeholder = '',
      required = false,
      disabled = false,
      invalid = false,
      ariaControls,
      ariaExpanded,
      ariaLabel,
      className,
      onChange,
      onClick,
      ...rest
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(value ?? '');
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
      setInputValue(value ?? '');
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDirty(true);
      setInputValue(event.target.value);
      onChange?.(event);
    };

    const classes = generateClasses(
      'input',
      { asButton, disabled, invalid },
      { asButton: true, disabled: true, invalid: true }
    );

    const allClasses = clsx(
      classes,
      dirty && 'input--dirty',
      icon && 'input--has-icon',
      iconStart && 'input--has-icon-start',
      type === 'hidden' && 'input--hidden',
      className
    );

    const inputProps = {
      name,
      type,
      placeholder,
      required,
      disabled,
      className: 'input__element',
      'data-test-id': 'input-input',
      'aria-controls': ariaControls,
      'aria-expanded': ariaExpanded,
      'aria-label': ariaLabel,
      ...rest,
    };

    return (
      <div className={allClasses}>
        <div className="input__addon input__addon--start" aria-hidden="true">
          {iconStart && <Icon icon={iconStart} size={iconSize} className="input__icon" />}
        </div>
        {asButton ? (
          <button
            ref={ref as React.Ref<HTMLButtonElement>}
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="input__element"
            {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
          >
            {inputValue}
          </button>
        ) : type === 'number' ? (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            {...inputProps}
            type="number"
            value={inputValue}
            onChange={handleChange}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            {...inputProps}
            value={inputValue}
            onChange={handleChange}
          />
        )}
        <div className="input__addon input__addon--end" aria-hidden="true">
          {icon && <Icon icon={icon} size={iconSize} className="input__icon" />}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

