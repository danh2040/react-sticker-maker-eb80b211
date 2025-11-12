import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { Button } from '../Button';
import arrowRightIcon from '../icons/m/arrow-right.svg';
import greenMainstreamAvatar from '@/assets/avatars/User_The_Green_Mainstream_Type_Avatar.png';
import './MainNavDropdown.scss';

export interface MenuItem {
  label: string;
  href: string;
  badge?: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface MainNavDropdownProps {
  signedIn?: boolean;
  userName?: string;
  userLevel?: string;
  levelProgress?: number; // 0-100
  avatarSrc?: string;
  menuSections?: MenuSection[];
  footerLinks?: { label: string; href: string }[];
  onSignUp?: () => void;
  onSignOut?: () => void;
  className?: string;
}

export const MainNavDropdown: React.FC<MainNavDropdownProps> = ({
  signedIn = false,
  userName = 'Guest user',
  userLevel = 'Level 1 - Ecocurious',
  levelProgress = 27, // Default progress for signed out
  avatarSrc,
  menuSections,
  footerLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Help', href: '#' },
    { label: 'Feedback', href: '#' },
  ],
  onSignUp,
  onSignOut,
  className,
}) => {
  // Default menu sections based on signed in state
  const defaultMenuSections: MenuSection[] = signedIn
    ? [
        {
          title: 'Your Ecosia',
          items: [
            { label: 'Your profile', href: '#' },
            { label: 'Collectibles', href: '#', badge: 'New' },
          ],
        },
        {
          title: 'Use Ecosia',
          items: [
            { label: 'Ecosia Search', href: '#' },
            { label: 'Ecosia Browser', href: '#' },
            { label: 'Ecosia for Companies', href: '#' },
          ],
        },
        {
          title: 'Search',
          items: [{ label: 'Settings', href: '#' }],
        },
      ]
    : [
        {
          title: 'Use Ecosia',
          items: [
            { label: 'Ecosia Search', href: '#' },
            { label: 'Ecosia Browser', href: '#' },
            { label: 'Ecosia for Companies', href: '#' },
          ],
        },
        {
          title: 'Search',
          items: [{ label: 'Settings', href: '#' }],
        },
      ];

  const sections = menuSections || defaultMenuSections;
  const progress = signedIn ? (levelProgress || 81) : 27; // Default progress values from Figma

  return (
    <div className={cn('main-nav-dropdown', className)}>
      <div className="main-nav-dropdown__body">
        {/* Hero Section */}
        <div className="main-nav-dropdown__hero">
          <div className="main-nav-dropdown__content">
            <div className="main-nav-dropdown__profile">
              {/* Circular Progress with Avatar */}
              <div className="main-nav-dropdown__level-progress">
                <svg
                  className="main-nav-dropdown__progress-ring"
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                >
                  {/* Background circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#DEDED9"
                    strokeWidth="8"
                  />
                  {/* Progress arc */}
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#F7BC00"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                    className="main-nav-dropdown__progress-arc"
                  />
                </svg>
                <div className="main-nav-dropdown__avatar-wrapper">
                  <Avatar
                    src={signedIn ? (avatarSrc || greenMainstreamAvatar) : undefined}
                    variant={signedIn ? 'default' : 'empty'}
                    alt={userName}
                    size="l"
                    className="main-nav-dropdown__avatar"
                  />
                </div>
              </div>

              <div className="main-nav-dropdown__profile-content">
                <h2 className="main-nav-dropdown__user-name">{userName}</h2>
                <div className="main-nav-dropdown__level-badge">
                  <Badge
                    variant={signedIn ? 'accent-yellow' : 'neutral'}
                    className="main-nav-dropdown__level-badge-inner"
                  >
                    {userLevel}
                  </Badge>
                </div>
              </div>
            </div>

            {!signedIn && (
              <Button
                variant="primary"
                size="lg"
                onClick={onSignUp}
                className="main-nav-dropdown__sign-up-button"
              >
                Sign up
              </Button>
            )}
          </div>
        </div>

        {/* Menu Sections */}
        <div className="main-nav-dropdown__menu">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="main-nav-dropdown__section">
              <h3 className="main-nav-dropdown__section-title">{section.title}</h3>
              <div className="main-nav-dropdown__list-items">
                {section.items.map((item, itemIndex) => (
                  <a
                    key={itemIndex}
                    href={item.href}
                    className={cn(
                      "main-nav-dropdown__list-item",
                      itemIndex === 1 && section.title === 'Your Ecosia' && "main-nav-dropdown__list-item--indented"
                    )}
                  >
                    <span className="main-nav-dropdown__list-item-text">{item.label}</span>
                    {item.badge && (
                      <Badge variant="featured" className="main-nav-dropdown__item-badge">
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="main-nav-dropdown__footer">
        {signedIn && (
          <Button
            variant="outline"
            size="lg"
            onClick={onSignOut}
            iconRight={<img src={arrowRightIcon} alt="" className="main-nav-dropdown__sign-out-icon" />}
            className="main-nav-dropdown__sign-out-button"
          >
            Sign out
          </Button>
        )}
        <div className="main-nav-dropdown__footer-links">
          {footerLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="main-nav-dropdown__footer-link"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

MainNavDropdown.displayName = 'MainNavDropdown';

