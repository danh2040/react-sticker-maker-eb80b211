import React from 'react';
import './AISearchButton.scss';

export interface AISearchButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const AISearchButton: React.FC<AISearchButtonProps> = ({
  onClick,
  children = 'AI Search',
  className = '',
}) => {
  return (
    <button
      className={`ai-search-button ${className}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

AISearchButton.displayName = 'AISearchButton';
