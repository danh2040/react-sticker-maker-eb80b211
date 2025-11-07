import React from 'react';
import './Popover.scss';

export type PopoverSide =
  | 'left-top'
  | 'left-center'
  | 'left-bottom'
  | 'right-top'
  | 'right-center'
  | 'right-bottom'
  | 'center-top'
  | 'center-bottom';

export interface PopoverProps {
  children?: React.ReactNode;
  content: React.ReactNode;
  visible: boolean;
  side?: PopoverSide;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  visible,
  side = 'left-top',
  className = '',
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
      <span
        className={`popover__arrow ${visible ? 'popover__arrow--visible' : ''}`}
        aria-hidden="true"
      />
      <div
        role="dialog"
        className={`popover__content ${visible ? 'popover__content--visible' : ''}`}
        data-test-id="popover-content"
      >
        {content}
      </div>
    </div>
  );
};

Popover.displayName = 'Popover';

