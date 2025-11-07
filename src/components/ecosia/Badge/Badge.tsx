import React from 'react';
import './Badge.scss';

export type BadgeVariant = 'featured' | 'neutral' | 'accent-yellow';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'featured',
  children,
  className = '',
}) => {
  const classes = ['badge', `badge--variant-${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
};

Badge.displayName = 'Badge';
