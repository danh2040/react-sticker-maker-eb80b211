import React, { forwardRef } from 'react';
import './Button.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  children?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  iconOnly?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', className = '', children, iconLeft, iconRight, iconOnly, ...props }, ref) => {
    const showText = !iconOnly && !!children;
    const isIconOnly = iconOnly || (!children && (!!iconLeft || !!iconRight));
    
    const classes = [
      'button',
      `button--variant-${variant}`,
      `button--size-${size}`,
      isIconOnly && 'button--icon-only',
      className
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classes} {...props}>
        {iconLeft && showText && <span className="button__icon-left">{iconLeft}</span>}
        {iconLeft && isIconOnly && !iconRight && iconLeft}
        {showText && children}
        {iconRight && showText && <span className="button__icon-right">{iconRight}</span>}
        {iconRight && isIconOnly && !iconLeft && iconRight}
      </button>
    );
  }
);

Button.displayName = 'Button';
