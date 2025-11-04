import React, { forwardRef } from 'react';
import { clsx, generateClasses } from '../utils/classes';
import { BaseButton, type BaseButtonProps } from './BaseButton';
import { Icon, type IconSize } from '../icon';
import './Button.scss';

export const iconPositions = ['start', 'end'] as const;
export type IconPosition = typeof iconPositions[number];

export const iconSizeDefaults: Record<string, IconSize> = {
  xs: 's',
  s: 's',
  m: 's',
  l: 'm',
};

export interface ButtonProps extends Omit<BaseButtonProps, 'children'> {
  /** Whether button is in active state */
  isActive?: boolean;
  /** Icon name */
  icon?: string;
  /** Icon name for left position (alternative to icon + iconPosition) */
  iconLeft?: string;
  /** Icon name for right position (alternative to icon + iconPosition) */
  iconRight?: string;
  /** Rotate icon 180 degrees */
  iconRotated?: boolean;
  /** Icon size override */
  iconSize?: IconSize;
  /** Icon position: start or end */
  iconPosition?: IconPosition;
  /** Stack text below icon on mobile */
  mobileStack?: boolean;
  /** Button size */
  size?: BaseButtonProps['size'];
  /** Tooltip text (shown only for icon-only buttons) */
  tooltipText?: string;
  /** Tooltip side */
  tooltipSide?: string;
  /** Loading state - shows loading spinner */
  loading?: boolean;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Children */
  children?: React.ReactNode;
  /** onClick handler */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Button component with icon support
 */
export const Button = forwardRef<HTMLElement, ButtonProps>(
  (
    {
      isActive = false,
      icon,
      iconLeft,
      iconRight,
      iconRotated = false,
      iconSize,
      iconPosition = 'start',
      mobileStack = false,
      size = 'm',
      tooltipText,
      tooltipSide = 'center-bottom',
      loading = false,
      style,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    // Support both icon+iconPosition and iconLeft/iconRight patterns
    const startIcon = iconLeft || (icon && iconPosition === 'start' ? icon : undefined);
    const endIcon = iconRight || (icon && iconPosition === 'end' ? icon : undefined);
    const hasIcons = Boolean(startIcon || endIcon);
    
    const hasText = Boolean(children);
    const computedIconSize = iconSize || iconSizeDefaults[size] || 's';
    
    // Determine actual iconPosition for class generation
    const actualIconPosition = iconLeft ? 'start' : iconRight ? 'end' : iconPosition;
    
    const classes = generateClasses(
      'button',
      { iconPosition: actualIconPosition, mobileStack },
      { iconPosition: true, mobileStack: true }
    );

    const buttonClasses = clsx(
      classes,
      hasIcons && !hasText && 'button-icon',
      className
    );

    const getIconClasses = (iconName?: string) => clsx(
      'button__icon',
      iconName && `button__icon--icon-${iconName}`,
      iconSize && `button__icon--size-${iconSize}`,
      iconRotated && 'button__icon--rotated'
    );

    const content = (
      <>
        {loading ? (
          <Icon icon="spinner" size={computedIconSize} className={getIconClasses('spinner')} />
        ) : (
          <>
            {startIcon && (
              <Icon icon={startIcon} size={computedIconSize} className={getIconClasses(startIcon)} />
            )}
            {hasText && <span className="button__text">{children}</span>}
            {endIcon && (
              <Icon icon={endIcon} size={computedIconSize} className={getIconClasses(endIcon)} />
            )}
          </>
        )}
      </>
    );

    // TODO: Implement tooltip wrapper when Tooltip component is ready
    // For now, use aria-label for accessibility
    const ariaLabel = tooltipText && !hasText ? tooltipText : rest['aria-label'];

    return (
      <BaseButton
        ref={ref}
        size={size}
        className={buttonClasses}
        aria-label={ariaLabel}
        disabled={loading || rest.disabled}
        style={style}
        {...rest}
      >
        {content}
      </BaseButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;

