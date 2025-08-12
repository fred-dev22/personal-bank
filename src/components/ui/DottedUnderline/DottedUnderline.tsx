import React from 'react';
import './DottedUnderline.css';

interface DottedUnderlineProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export const DottedUnderline: React.FC<DottedUnderlineProps> = ({
  children,
  color = '#00B5AE',
  className = ''
}) => {
  return (
    <span 
      className={`dotted-underline ${className}`}
      style={{
        '--dot-color': color
      } as React.CSSProperties}
    >
      {children}
    </span>
  );
}; 