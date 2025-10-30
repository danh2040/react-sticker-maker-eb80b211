import React from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

/**
 * Card component for grouping content
 * @component
 */
const Card = ({
  as: Component = 'div',
  overflowVisible = false,
  padding = false,
  border = false,
  children,
  className = '',
  ...props
}) => {
  const classes = [
    'card',
    `card--as-${Component}`,
    overflowVisible && 'card--overflow-visible',
    padding && 'card--padding',
    border && 'card--border',
    className
  ].filter(Boolean).join(' ');

  const rel = Component === 'a' ? 'noopener' : undefined;

  return (
    <Component className={classes} rel={rel} {...props}>
      {children}
    </Component>
  );
};

Card.propTypes = {
  as: PropTypes.oneOf(['div', 'a', 'button']),
  overflowVisible: PropTypes.bool,
  padding: PropTypes.bool,
  border: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Card;
