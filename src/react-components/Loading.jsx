import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import './Loading.scss';

/**
 * Loading spinner component
 * @component
 */
const Loading = ({ className = '' }) => {
  return (
    <div className={`loading ${className}`} aria-label="Loading indicator" role="img">
      <div className="loading__container">
        <Icon
          className="loading__icon"
          icon="source-ecosia"
          data-test-id="loading-icon"
        />
        <svg className="loading__spinner" width="28" height="28" viewBox="25 25 50 50">
          <circle
            className="loading__spinner-circle"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="3"
            strokeMiterlimit="10"
            data-test-id="loading-spinner"
          />
        </svg>
      </div>
    </div>
  );
};

Loading.propTypes = {
  className: PropTypes.string,
};

export default Loading;
