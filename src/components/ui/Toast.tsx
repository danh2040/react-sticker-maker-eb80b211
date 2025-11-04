import React, { ReactNode, useEffect } from 'react';
import { clsx, generateClasses } from '../utils/classes';
import { Icon } from '../icon/Icon';
import { Button } from '../button/Button';
import './Toast.scss';

export const variants = ['neutral', 'informative', 'positive', 'negative'] as const;
export type ToastVariant = typeof variants[number];

export const durations = {
  DEFAULT: 5000,
  EXTENDED: 10000,
} as const;

const variantIcons: Record<ToastVariant, string | null> = {
  neutral: null,
  informative: 'info-circle',
  positive: 'check-circle',
  negative: 'problem',
};

export interface ToastProps {
  /** Toast content */
  children: ReactNode;
  /** Visual variant */
  variant?: ToastVariant;
  /** Whether the toast is visible */
  show: boolean;
  /** Align toast to the right */
  right?: boolean;
  /** Auto-dismiss duration in milliseconds (0 = no auto-dismiss) */
  duration?: number;
  /** Additional class name */
  className?: string;
  /** Callback when dismiss button is clicked */
  onDismiss?: () => void;
}

/**
 * Toast notification component for temporary messages
 */
export const Toast: React.FC<ToastProps> = ({
  children,
  variant = 'neutral',
  show,
  right = false,
  duration = 0,
  className,
  onDismiss,
}) => {
  const icon = variantIcons[variant];

  // Auto-dismiss functionality
  useEffect(() => {
    if (show && duration > 0 && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onDismiss]);

  const classes = generateClasses(
    'toast',
    { variant, right },
    { variant: true, right: true }
  );

  return (
    <div
      className={clsx(classes, className, show && 'toast--show', !show && 'toast--hidden')}
      role="log"
      aria-live="polite"
      data-test-id="toast"
    >
      <div className="toast__body">
        {icon && <Icon icon={icon} />}
        <div className="toast-body__text">{children}</div>
        {onDismiss && (
          <Button
            className="toast__button"
            data-test-id="dismiss"
            variant="bare"
            icon="close"
            onClick={onDismiss}
          />
        )}
      </div>
    </div>
  );
};

export default Toast;

