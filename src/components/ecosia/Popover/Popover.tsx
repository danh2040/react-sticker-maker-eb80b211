import React from 'react';
import { Badge } from '../Badge';
import { Button } from '@/components/ui/button';
import './Popover.scss';

export type PopoverSide =
  | 'left-top'
  | 'left-center'
  | 'left-bottom'
  | 'right-top'
  | 'right-center'
  | 'right-bottom'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center-top'
  | 'center-bottom';

export interface PopoverProps {
  children?: React.ReactNode;
  content: React.ReactNode;
  visible: boolean;
  side?: PopoverSide;
  className?: string;
  showBadge?: boolean;
  showImage?: boolean;
  showPointer?: boolean;
  showStep?: boolean;
  showSkipButton?: boolean;
  showTrailingButton?: boolean;
  badge?: string;
  title?: string;
  imageUrl?: string;
  step?: string;
  skipButtonText?: string;
  trailingButtonText?: string;
  onSkipButtonClick?: () => void;
  onTrailingButtonClick?: () => void;
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  visible,
  side = 'left-top',
  className = '',
  showBadge = false,
  showImage = false,
  showPointer = true,
  showStep = false,
  showSkipButton = false,
  showTrailingButton = false,
  badge = 'New',
  title,
  imageUrl,
  step = '1 / 2',
  skipButtonText = 'Skip',
  trailingButtonText = 'Got it',
  onSkipButtonClick,
  onTrailingButtonClick,
}) => {
  const hasToggle = !!children;

  const classes = [
    'popover',
    `popover--side-${side}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {hasToggle && (
        <span
          className="popover__toggle"
          tabIndex={0}
          role="button"
          data-test-id="popover-toggle"
          aria-expanded={visible ? 'true' : 'false'}
          aria-haspopup="dialog"
        >
          {children}
        </span>
      )}
      {showPointer && (
        <span
          className={`popover__arrow ${visible ? 'popover__arrow--visible' : ''}`}
          aria-hidden="true"
        />
      )}
      <div
        role="dialog"
        className={`popover__content ${visible ? 'popover__content--visible' : ''}`}
        data-test-id="popover-content"
      >
        {showImage && imageUrl && (
          <div className="popover__image">
            <img src={imageUrl} alt="Popover visual" />
          </div>
        )}
        {(showBadge || title) && (
          <div className="popover__header">
            {showBadge && <Badge variant="neutral">{badge}</Badge>}
            {title && <h3 className="popover__title">{title}</h3>}
          </div>
        )}
        <div className="popover__body">
          {content}
        </div>
        <div className="popover__footer">
          {showStep && (
            <span className="popover__step">{step}</span>
          )}
          <div className="popover__actions">
            {showSkipButton && (
              <Button 
                variant="ghost"
                size="default"
                onClick={onSkipButtonClick}
                className="popover__button-skip"
              >
                {skipButtonText}
              </Button>
            )}
            {showTrailingButton && (
              <Button 
                variant="outline"
                size="default"
                onClick={onTrailingButtonClick}
                className="popover__button-primary"
              >
                {trailingButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Popover.displayName = 'Popover';

