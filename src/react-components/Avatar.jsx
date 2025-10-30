import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import './Avatar.scss';

export const SIZES = {
  xs: 24,
  s: 32,
  m: 48,
  l: 64,
  xl: 96,
};

/**
 * Avatar component for displaying user profile images
 * @component
 */
const Avatar = ({
  isSignedIn = false,
  picture = null,
  size = 's',
  className = '',
}) => {
  const [hasImageError, setHasImageError] = useState(false);
  
  const sizePixels = `${SIZES[size]}px`;
  const placeholderStyle = {
    width: sizePixels,
    height: sizePixels,
  };

  const handleImageError = () => {
    setHasImageError(true);
  };

  // Signed out placeholder
  if (!isSignedIn) {
    return (
      <div
        data-test-id="avatar-signed-out-placeholder"
        className={`avatar avatar--signed-out-placeholder ${className}`}
        aria-hidden="true"
        data-clarity-mask="true"
        style={placeholderStyle}
      >
        <Icon icon="me" size="m" />
      </div>
    );
  }

  // Signed in with valid picture
  if (picture && !hasImageError) {
    return (
      <img
        className={`avatar ${className}`}
        src={picture}
        alt="User avatar"
        style={placeholderStyle}
        onError={handleImageError}
      />
    );
  }

  // Signed in placeholder (fallback)
  return (
    <div
      data-test-id="avatar"
      className={`avatar avatar--signed-in-placeholder ${className}`}
      aria-hidden="true"
      style={placeholderStyle}
    >
      {/* Placeholder SVG or icon for signed in users */}
      <Icon icon="me" size="m" />
    </div>
  );
};

Avatar.propTypes = {
  isSignedIn: PropTypes.bool,
  picture: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(SIZES)),
  className: PropTypes.string,
};

export default Avatar;
