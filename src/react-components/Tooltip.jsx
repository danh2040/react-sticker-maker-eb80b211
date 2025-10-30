import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Tooltip.scss';

export const sides = [
  'left-top',
  'left-center',
  'left-bottom',
  'right-top',
  'right-center',
  'right-bottom',
  'center-top',
  'center-bottom',
  'center-bottom-left-aligned',
];
export const sizes = ['l', 'm', 's'];
export const hideDelay = 300;

/**
 * Tooltip component for displaying contextual information
 * @component
 */
const Tooltip = ({
  focusable = true,
  padding = true,
  side = 'left-top',
  size = 'm',
  openOnHover = true,
  closeOnMouseLeave = false,
  openOnFocus = true,
  openOnStart = false,
  colorVariant = 'default',
  closeOnScroll = true,
  content,
  children,
  onTooltipOpened,
  onTooltipHovered,
  className = '',
}) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [opened, setOpened] = useState(openOnStart);
  const timeoutRef = useRef(null);
  const toggleRef = useRef(null);

  const visible = opened || (openOnHover && hovered) || (openOnFocus && focused);

  useEffect(() => {
    const handleScroll = () => {
      if (closeOnScroll && opened) {
        setOpened(false);
      }
    };

    if (closeOnScroll && opened) {
      document.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (closeOnScroll) {
        document.removeEventListener('scroll', handleScroll);
      }
    };
  }, [opened, closeOnScroll]);

  useEffect(() => {
    if (opened || (openOnHover && hovered) || (openOnFocus && focused)) {
      onTooltipOpened?.();
    }
  }, [opened, hovered, focused, openOnHover, openOnFocus, onTooltipOpened]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHovered(true);
    onTooltipHovered?.();
  };

  const handleMouseLeave = () => {
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        setHovered(false);
      }, hideDelay);
    }
    if (closeOnMouseLeave) {
      setOpened(false);
    }
  };

  const handleFocusIn = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setFocused(true);
  };

  const handleFocusOut = () => {
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        setFocused(false);
      }, hideDelay);
    }
  };

  const toggle = () => {
    setOpened(!opened);
  };

  const close = () => {
    setOpened(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  };

  const classes = [
    'tooltip',
    `tooltip--side-${side}`,
    `tooltip--size-${size}`,
    `tooltip--color-variant-${colorVariant}`,
    padding && 'tooltip--padding',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    >
      <span
        ref={toggleRef}
        className="tooltip__toggle"
        tabIndex={focusable ? 0 : -1}
        role={focusable ? 'button' : null}
        data-test-id="tooltip-toggle"
        aria-expanded={opened ? 'true' : 'false'}
        aria-controls="tooltip-content"
        aria-haspopup="dialog"
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        {children}
        {visible && (
          <span className="tooltip__arrow" aria-hidden="true" />
        )}
      </span>
      {visible && (
        <div
          id="tooltip-content"
          role="dialog"
          className="tooltip__content"
          data-test-id="tooltip-content"
          onKeyUp={(e) => e.key === 'Escape' && close()}
        >
          {content}
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  focusable: PropTypes.bool,
  padding: PropTypes.bool,
  side: PropTypes.oneOf(sides),
  size: PropTypes.oneOf(sizes),
  openOnHover: PropTypes.bool,
  closeOnMouseLeave: PropTypes.bool,
  openOnFocus: PropTypes.bool,
  openOnStart: PropTypes.bool,
  colorVariant: PropTypes.oneOf(['default', 'brand-secondary']),
  closeOnScroll: PropTypes.bool,
  content: PropTypes.node,
  children: PropTypes.node,
  onTooltipOpened: PropTypes.func,
  onTooltipHovered: PropTypes.func,
  className: PropTypes.string,
};

export default Tooltip;

