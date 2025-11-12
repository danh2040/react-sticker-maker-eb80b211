import React from 'react';
import './Avatar.scss';
import avatarEmptyIcon from '../icons/m/avatar-empty.svg';

export type AvatarSize = 's' | 'm' | 'l';
export type AvatarVariant = 'default' | 'empty';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  children?: React.ReactNode;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'm',
  variant = 'default',
  children,
  className = '',
}) => {
  const classes = ['avatar', `avatar--size-${size}`, variant === 'empty' && 'avatar--empty', className]
    .filter(Boolean)
    .join(' ');

  if (variant === 'empty') {
    return (
      <div className={classes}>
        <img src={avatarEmptyIcon} alt={alt} className="avatar__image" />
      </div>
    );
  }

  return (
    <div className={classes}>
      {src ? (
        <img src={src} alt={alt} className="avatar__image" />
      ) : (
        <div className="avatar__placeholder">{children}</div>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';
