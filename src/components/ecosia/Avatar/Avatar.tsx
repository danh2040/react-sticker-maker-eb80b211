import React from 'react';
import './Avatar.scss';

export type AvatarSize = 's' | 'm' | 'l';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  children?: React.ReactNode;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'm',
  children,
  className = '',
}) => {
  const classes = ['avatar', `avatar--size-${size}`, className]
    .filter(Boolean)
    .join(' ');

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
