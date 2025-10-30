import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Icon.scss';

export const sizes = ['l', 'm', 's'];

/**
 * Icon component for displaying SVG icons
 * @component
 */
const Icon = ({
  icon,
  size = 'm',
  className = '',
  ...props
}) => {
  const [IconComponent, setIconComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sizes.includes(size)) {
      console.warn(`Invalid icon size: ${size}`);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Dynamically import the SVG icon
    import(`../components/icons/${size}/${icon}.svg`)
      .then((module) => {
        setIconComponent(() => module.default);
        setLoading(false);
      })
      .catch((error) => {
        console.error(`Failed to load icon: ${icon}`, error);
        setLoading(false);
      });
  }, [icon, size]);

  const classes = [
    'icon',
    `icon--icon-${icon}`,
    `icon--size-${size}`,
    className
  ].filter(Boolean).join(' ');

  if (loading || !IconComponent) {
    return null;
  }

  return <IconComponent className={classes} {...props} />;
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOf(sizes),
  className: PropTypes.string,
};

export default Icon;

