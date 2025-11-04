import React, { forwardRef, ElementType, HTMLAttributes, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { clsx, generateClasses } from '../utils/classes';
import './Card.scss';

export interface CardProps {
  /** Element tag to render */
  as?: ElementType;
  /** Show overflow content */
  overflowVisible?: boolean;
  /** Add padding */
  padding?: boolean;
  /** Add border */
  border?: boolean;
  /** Additional class name */
  className?: string;
  /** Children */
  children?: React.ReactNode;
}

type ConditionalProps<T extends ElementType> =
  T extends 'a' ? AnchorHTMLAttributes<HTMLAnchorElement> :
  T extends 'button' ? ButtonHTMLAttributes<HTMLButtonElement> :
  HTMLAttributes<HTMLElement>;

type CardComponentProps<T extends ElementType = 'div'> = CardProps & Omit<ConditionalProps<T>, keyof CardProps>;

/**
 * Card component for content containers
 */
export const Card = forwardRef<HTMLElement, CardComponentProps>(
  (
    {
      as: Component = 'div',
      overflowVisible = false,
      padding = false,
      border = false,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const classes = generateClasses(
      'card',
      { as: Component, overflowVisible, padding, border },
      { as: true, overflowVisible: true, padding: true, border: true }
    );

    const rel = Component === 'a' ? 'noopener' : undefined;

    return (
      <Component
        ref={ref}
        className={clsx(classes, className)}
        rel={rel}
        {...rest}
      >
        {children}
      </Component>
    );
  }
) as <T extends ElementType = 'div'>(
  props: CardComponentProps<T> & { ref?: React.Ref<HTMLElement> }
) => React.ReactElement;

Card.displayName = 'Card';

export default Card;

