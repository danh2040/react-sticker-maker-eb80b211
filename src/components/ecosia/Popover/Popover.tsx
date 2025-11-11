import React from 'react';
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
  showTrailingButton?: boolean;
  badge?: string;
  imageUrl?: string;
  step?: string;
  trailingButtonText?: string;
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
  showTrailingButton = false,
  badge = 'New',
  imageUrl,
  step = '1 / 2',
  trailingButtonText = 'Got it',
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
        {showBadge && (
          <div className="popover__badge">
            <span className="popover__badge-text">{badge}</span>
          </div>
        )}
        {showImage && imageUrl && (
          <div className="popover__image">
            <img src={imageUrl} alt="Popover visual" />
          </div>
        )}
        <div className="popover__body">
          {content}
        </div>
        <div className="popover__footer">
          {showStep && (
            <span className="popover__step">{step}</span>
          )}
          {showTrailingButton && (
            <button 
              className="popover__button"
              onClick={onTrailingButtonClick}
            >
              {trailingButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

Popover.displayName = 'Popover';

