import React from 'react';
import PropTypes from 'prop-types';
import './Badge.scss';

export const variants = ['featured', 'neutral', 'accent-yellow'];

/**
 * Badge component for displaying status or category indicators
 * @component
 */
const Badge = ({ variant = 'featured', children, className = '', ...props }) => {
  const classes = ['badge', `badge--variant-${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  variant: PropTypes.oneOf(variants),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Badge;
