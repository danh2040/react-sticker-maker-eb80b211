import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '../Avatar';
import seedIconM from '../icons/m/seed.svg';
import seedIconS from '../icons/s/seed.svg';
import lockIcon from '../icons/m/privacy-locked.svg';
import sparkleIconS from '../icons/s/sparkle.svg';
import sparkleIconM from '../icons/m/sparkle.svg';
import greenMainstreamAvatar from '@/assets/avatars/User_The_Green_Mainstream_Type_Avatar.png';
import './MainNavButton.scss';

export type MainNavButtonState = 'Default' | 'Hover' | 'Active' | 'Focus';
export type MainNavButtonStatus = 'Default' | 'New level' | 'New seed' | 'Locked';

export interface MainNavButtonProps {
  value?: string;
  notificationPill?: boolean;
  signedIn?: boolean;
  state?: MainNavButtonState;
  status?: MainNavButtonStatus;
  avatarSrc?: string;
  onClick?: () => void;
  className?: string;
}

export const MainNavButton: React.FC<MainNavButtonProps> = ({
  value = '1',
  notificationPill = false,
  signedIn = false,
  state = 'Default',
  status = 'Default',
  avatarSrc,
  onClick,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [showNewValue, setShowNewValue] = useState(false);

  // Handle "New seed" status animation
  useEffect(() => {
    if (status === 'New seed') {
      const timer = setTimeout(() => {
        setShowNewValue(true);
        const newValue = String(parseInt(value) + 1);
        setCurrentValue(newValue);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setCurrentValue(value);
      setShowNewValue(false);
    }
  }, [status, value]);

  const effectiveState = state === 'Default' && isHovered ? 'Hover' : state;

  const buttonClasses = cn(
    'main-nav-button',
    `main-nav-button--state-${effectiveState.toLowerCase()}`,
    `main-nav-button--status-${status.toLowerCase().replace(' ', '-')}`,
    signedIn && 'main-nav-button--signed-in',
    className
  );

  const seedCounterClasses = cn(
    'main-nav-button__seed-counter',
    status === 'New seed' && 'main-nav-button__seed-counter--new-seed'
  );

  const handleMouseEnter = () => {
    if (state === 'Default') {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Main navigation"
    >
      <div className={seedCounterClasses}>
        {status === 'New seed' ? (
          <div className="main-nav-button__seed-icon main-nav-button__seed-icon--new-seed">
            <div className="main-nav-button__seed-icon-wrapper">
              <div className="main-nav-button__seed-icon-rotated">
                <img src={seedIconS} alt="Seed" className="main-nav-button__seed-icon-img" />
              </div>
            </div>
          </div>
        ) : (
          <div className="main-nav-button__seed-icon">
            <div className="main-nav-button__seed-icon-inner">
              <img src={seedIconM} alt="Seed" className="main-nav-button__seed-icon-img" />
            </div>
          </div>
        )}
        
        <p className="main-nav-button__seed-value">
          {status === 'New seed' && showNewValue ? (
            <>
              <span className="main-nav-button__seed-value-old">{value}</span>
              <span className="main-nav-button__seed-value-new">{currentValue}</span>
            </>
          ) : (
            currentValue
          )}
        </p>
        
        {status === 'Locked' && (
          <div className="main-nav-button__lock-icon">
            <div className="main-nav-button__lock-icon-inner">
              <img src={lockIcon} alt="Locked" className="main-nav-button__lock-icon-img" />
            </div>
          </div>
        )}
      </div>

      <div className="main-nav-button__avatar">
        {signedIn ? (
          <Avatar 
            src={avatarSrc || greenMainstreamAvatar} 
            alt="User avatar" 
            size="m"
            className="main-nav-button__avatar-component"
          />
        ) : (
          <Avatar 
            variant="empty" 
            alt="User" 
            size="m"
            className="main-nav-button__avatar-component"
          />
        )}
      </div>

      {status === 'New level' && (
        <div className="main-nav-button__sparkles">
          <div className="main-nav-button__sparkle main-nav-button__sparkle--1">
            <div className="main-nav-button__sparkle-inner">
              <img src={sparkleIconS} alt="" className="main-nav-button__sparkle-img" />
            </div>
          </div>
          <div className="main-nav-button__sparkle main-nav-button__sparkle--2">
            <div className="main-nav-button__sparkle-inner">
              <img src={sparkleIconM} alt="" className="main-nav-button__sparkle-img" />
            </div>
          </div>
          <div className="main-nav-button__sparkle main-nav-button__sparkle--3">
            <div className="main-nav-button__sparkle-inner">
              <img src={sparkleIconM} alt="" className="main-nav-button__sparkle-img" />
            </div>
          </div>
        </div>
      )}

      {status === 'New seed' && (
        <div className="main-nav-button__new-seed-badge">
          <span className="main-nav-button__new-seed-badge-text">+1</span>
        </div>
      )}

      {notificationPill && (
        <div className="main-nav-button__notification-pill" />
      )}

      {effectiveState === 'Focus' && (
        <div className="main-nav-button__focus-ring" />
      )}
    </button>
  );
};

MainNavButton.displayName = 'MainNavButton';
