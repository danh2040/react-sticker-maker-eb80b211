import React from 'react';
import './AdPill.scss';

export interface AdPillProps {
  text?: string;
}

export const AdPill: React.FC<AdPillProps> = ({ text = 'Ad' }) => {
  return <span className="ad-pill">{text}</span>;
};

AdPill.displayName = 'AdPill';
