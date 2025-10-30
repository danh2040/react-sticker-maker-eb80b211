import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import './Input.scss';

/**
 * Input component for text input fields
 * @component
 */
const Input = ({
  asButton = false,
  value = null,
  name = '',
  type = 'text',
  icon = null,
  iconStart = null,
  iconSize = 'm',
  placeholder = '',
  required = false,
  disabled = false,
  invalid = false,
  ariaControls = null,
  ariaExpanded = null,
  ariaLabel = null,
  onChange,
  className = '',
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const classes = [
    'input',
    asButton && 'input--as-button',
    disabled && 'input--disabled',
    invalid && 'input--invalid',
    dirty && 'input--dirty',
    icon && 'input--has-icon',
    iconStart && 'input--has-icon-start',
    type === 'hidden' && 'input--hidden',
    className
  ].filter(Boolean).join(' ');

  const handleChange = (e) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setInputValue(newValue);
    setDirty(true);
    onChange?.(newValue);
  };

  const sharedProps = {
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
    ...props
  };

  return (
    <div className={classes}>
      <div className="input__addon input__addon--start" aria-hidden="true">
        {iconStart && <Icon className="input__icon" icon={iconStart} size={iconSize} />}
      </div>
      {asButton ? (
        <button type="button" {...sharedProps}>
          {inputValue}
        </button>
      ) : (
        <input
          {...sharedProps}
          value={inputValue || ''}
          onChange={handleChange}
        />
      )}
      <div className="input__addon input__addon--end" aria-hidden="true">
        {icon && <Icon className="input__icon" icon={icon} size={iconSize} />}
      </div>
    </div>
  );
};

Input.propTypes = {
  asButton: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.string,
  iconStart: PropTypes.string,
  iconSize: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  ariaControls: PropTypes.string,
  ariaExpanded: PropTypes.string,
  ariaLabel: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default Input;
