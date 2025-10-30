import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Modal.scss';

const sizes = ['s', 'm', 'l', 'xl'];
const ariaModalModes = ['dialog', 'alertdialog'];

/**
 * Modal component for dialog overlays
 * @component
 */
const Modal = ({
  active = false,
  closeButton = true,
  elevationBackground = false,
  featureSize = 'm',
  padding = '4l',
  size = 'm',
  role = 'dialog',
  scrollableBody = false,
  onClose,
  onModalDisplay,
  feature,
  header,
  footer,
  children,
  className = '',
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isContentScrollable, setIsContentScrollable] = useState(false);
  const contentRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (active) {
      // Add scroll lock to body
      if (!scrollableBody) {
        document.body.classList.add('modal__no-scroll');
      }
      onModalDisplay?.();

      // Check if content is scrollable
      if (footer && contentRef.current) {
        const isScrollable = contentRef.current.clientHeight < contentRef.current.scrollHeight;
        setIsContentScrollable(isScrollable);
      }
    } else {
      // Remove scroll lock
      document.body.classList.remove('modal__no-scroll');
      setScrolled(false);
    }

    return () => {
      document.body.classList.remove('modal__no-scroll');
    };
  }, [active, scrollableBody, footer, onModalDisplay]);

  const handleClickaway = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.('clickaway');
    }
  };

  const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
      onClose?.('esc');
    }
  };

  const handleScroll = (e) => {
    setScrolled(e.target.scrollTop > 0);
  };

  const classes = [
    'modal',
    `modal--size-${size}`,
    `modal--padding-${padding}`,
    elevationBackground && 'modal--elevation-background',
    scrolled && 'modal--scrolled',
    className
  ].filter(Boolean).join(' ');

  if (!active) {
    return null;
  }

  return (
    <div
      ref={modalRef}
      className={classes}
      aria-modal="true"
      role={role}
      onClick={handleClickaway}
      onKeyUp={handleEscapeKey}
    >
      <div className="modal__dialog">
        {feature && (
          <div
            className={`modal__feature modal__feature--${featureSize}`}
            data-test-id="modal-feature"
          >
            {feature}
          </div>
        )}
        <div className={`modal__header ${closeButton ? 'modal__header--with-button' : ''}`}>
          {closeButton && (
            <div className="modal__close">
              <button
                className="button button-icon"
                aria-label="Close"
                data-test-id="close"
                onClick={() => onClose?.('button')}
              >
                ✕
              </button>
            </div>
          )}
          {header && header}
        </div>
        <div
          ref={contentRef}
          className={`modal__content ${header ? 'modal__content--with-header' : ''} ${footer ? 'modal__content--with-footer' : ''}`}
          onClick={(e) => e.stopPropagation()}
          onScroll={handleScroll}
        >
          {children}
        </div>
        {footer && (
          <div className={`modal__footer ${isContentScrollable ? 'modal__footer--with-shadow' : ''}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  active: PropTypes.bool,
  closeButton: PropTypes.bool,
  elevationBackground: PropTypes.bool,
  featureSize: PropTypes.oneOf(['s', 'm']),
  padding: PropTypes.oneOf(['none', 'm', '2l', '4l']),
  size: PropTypes.oneOf(sizes),
  role: PropTypes.oneOf(ariaModalModes),
  scrollableBody: PropTypes.bool,
  onClose: PropTypes.func,
  onModalDisplay: PropTypes.func,
  feature: PropTypes.node,
  header: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Modal;
