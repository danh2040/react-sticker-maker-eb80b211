import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import './Illustration.scss';

interface IllustrationProps {
  src: string;
  alt?: string;
  className?: string;
}

export const Illustration: React.FC<IllustrationProps> = ({ 
  src, 
  alt = '', 
  className 
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Fetch the SVG content
    fetch(src)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch SVG');
        }
        return response.text();
      })
      .then((text) => {
        setSvgContent(text);
        setError(false);
      })
      .catch((err) => {
        console.error('Error loading SVG:', err);
        setError(true);
      });
  }, [src]);

  if (error) {
    return (
      <div className={cn('illustration illustration--error', className)}>
        <span className="illustration__fallback">Illustration</span>
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div className={cn('illustration illustration--loading', className)}>
        <span className="illustration__fallback">Loading...</span>
      </div>
    );
  }

  // Render the SVG inline so it can access CSS variables
  return (
    <div 
      className={cn('illustration', className)}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

