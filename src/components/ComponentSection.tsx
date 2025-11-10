import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ComponentSectionProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const ComponentSection = ({ id, title, description, children }: ComponentSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section id={id} className="scroll-mt-20 border-b border-border pb-12 mb-12">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 p-2 hover:bg-muted rounded-md transition-colors"
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-8">
          {children}
        </div>
      )}
    </section>
  );
};
