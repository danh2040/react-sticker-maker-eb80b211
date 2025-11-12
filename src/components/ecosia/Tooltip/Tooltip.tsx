import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.scss';

export type TooltipSide =
  | 'left-top'
  | 'left-center'
  | 'left-bottom'
  | 'right-top'
  | 'right-center'
  | 'right-bottom'
  | 'center-top'
  | 'center-bottom'
  | 'center-bottom-left-aligned';

export type TooltipSize = 'l' | 'm' | 's';
export type TooltipColorVariant = 'default' | 'brand-secondary';

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  focusable?: boolean;
  padding?: boolean;
  side?: TooltipSide;
  size?: TooltipSize;
  openOnHover?: boolean;
  closeOnMouseLeave?: boolean;
  openOnFocus?: boolean;
  openOnStart?: boolean;
  colorVariant?: TooltipColorVariant;
  closeOnScroll?: boolean;
  className?: string;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

const HIDE_DELAY = 300;

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
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
  className = '',
  visible: controlledVisible,
  onVisibleChange,
}) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [opened, setOpened] = useState(openOnStart);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const internalVisible = opened || (openOnHover && hovered) || (openOnFocus && focused);
  // If controlled and explicitly false, hide. Otherwise allow hover/focus to work
  const visible = controlledVisible === false ? false : (controlledVisible || internalVisible);

  const classes = [
    'tooltip',
    `tooltip--side-${side}`,
    `tooltip--size-${size}`,
    `tooltip--color-variant-${colorVariant}`,
    padding && 'tooltip--padding',
    className
  ].filter(Boolean).join(' ');

  useEffect(() => {
    const handleScroll = () => {
      if (closeOnScroll && visible) {
        setOpened(false);
      }
    };

    if (closeOnScroll && (opened || hovered || focused)) {
      document.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [closeOnScroll, opened, hovered, focused, visible]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHovered(true);
    if (onVisibleChange) {
      onVisibleChange(true);
    }
  };

  const handleMouseLeave = () => {
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        setHovered(false);
        if (onVisibleChange) {
          onVisibleChange(false);
        }
      }, HIDE_DELAY);
    }
    if (closeOnMouseLeave) {
      setOpened(false);
      if (onVisibleChange) {
        onVisibleChange(false);
      }
    }
  };

  const handleFocusIn = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setFocused(true);
    if (onVisibleChange) {
      onVisibleChange(true);
    }
  };

  const handleFocusOut = () => {
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        setFocused(false);
        if (onVisibleChange) {
          onVisibleChange(false);
        }
      }, HIDE_DELAY);
    }
  };

  const handleToggle = () => {
    const newOpened = !opened;
    setOpened(newOpened);
    if (onVisibleChange) {
      onVisibleChange(newOpened);
    }
  };

  const handleClose = () => {
    setOpened(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      ref={tooltipRef}
      className={classes}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    >
      <span
        className="tooltip__toggle"
        tabIndex={focusable ? 0 : -1}
        role={focusable ? 'button' : undefined}
        data-test-id="tooltip-toggle"
        aria-expanded={opened ? 'true' : 'false'}
        aria-haspopup="dialog"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        {children}
        <span
          className={`tooltip__arrow ${visible ? 'tooltip__arrow--visible' : ''}`}
          aria-hidden="true"
        />
      </span>
      <div
        role="dialog"
        className={`tooltip__content ${visible ? 'tooltip__content--visible' : ''}`}
        data-test-id="tooltip-content"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            handleClose();
          }
        }}
      >
        {content}
      </div>
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

