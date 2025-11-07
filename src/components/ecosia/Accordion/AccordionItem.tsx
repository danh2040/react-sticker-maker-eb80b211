import React, { useState } from 'react';
import { useAccordion } from './Accordion';
import './AccordionItem.scss';

export interface AccordionItemProps {
  index: number;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  index,
  title,
  children,
  className = '',
}) => {
  const { activeIndex, setActiveIndex } = useAccordion();
  const isOpen = activeIndex === index;

  const toggle = () => {
    setActiveIndex(isOpen ? null : index);
  };

  return (
    <div className={`accordion-item ${className}`}>
      <button
        className="accordion-item__header"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        {title}
      </button>
      <div
        className={`accordion-item__content ${isOpen ? 'accordion-item__content--open' : ''}`}
      >
        <div className="accordion-item__content-inner">{children}</div>
      </div>
    </div>
  );
};

AccordionItem.displayName = 'AccordionItem';
