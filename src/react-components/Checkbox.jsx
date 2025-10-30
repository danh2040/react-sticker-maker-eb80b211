import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import './Checkbox.scss';

/**
 * Checkbox component for single boolean input
 * @component
 */
const Checkbox = ({
  id = null,
  value = false,
  name = null,
  required = false,
  disabled = false,
  onChange,
  className = '',
  ...props
}) => {
  const inputRef = useRef(null);
  const checked = !!value;

  const classes = [
    'checkbox',
    disabled && 'checkbox--disabled',
    checked && 'checkbox--checked',
    className
  ].filter(Boolean).join(' ');

  const handleWrapperClick = (e) => {
    if (e.target !== inputRef.current) {
      inputRef.current?.click();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      inputRef.current?.click();
    }
  };

  const handleInput = (e) => {
    const newValue = e.target.checked;
    onChange?.(newValue);
  };

  return (
    <div
      className={classes}
      tabIndex="0"
      onClick={handleWrapperClick}
      onKeyDown={handleKeyDown}
    >
      <div className="checkbox__icon">
        <Icon className="checkbox__check" icon="check" size="s" />
      </div>
      <input
        ref={inputRef}
        className="checkbox__input"
        type="checkbox"
        tabIndex="-1"
        data-test-id="checkbox-input"
        checked={checked}
        disabled={disabled}
        required={required}
        name={name}
        id={id}
        onChange={handleInput}
        {...props}
      />
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.array]),
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default Checkbox;
