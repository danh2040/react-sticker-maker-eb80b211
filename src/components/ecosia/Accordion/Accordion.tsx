import React, { createContext, useContext, useState } from 'react';
import './Accordion.scss';

interface AccordionContextType {
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an Accordion');
  }
  return context;
};

export interface AccordionProps {
  defaultOpenIndex?: number | null;
  children: React.ReactNode;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  defaultOpenIndex = null,
  children,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <AccordionContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className={`accordion ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
};

Accordion.displayName = 'Accordion';
