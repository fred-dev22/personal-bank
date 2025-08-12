import React, { useState, useRef, useEffect } from 'react';
import './HelpTooltip.css';

interface HelpTooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  term,
  definition,
  children,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipClass, setTooltipClass] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && containerRef.current && tooltipRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      let newClass = '';
      
      // Check if tooltip would overflow left
      if (containerRect.left + tooltipRect.width / 2 < 20) {
        newClass = 'help-tooltip-left-edge';
      }
      // Check if tooltip would overflow right
      else if (containerRect.right - tooltipRect.width / 2 > viewportWidth - 20) {
        newClass = 'help-tooltip-right-edge';
      }
      
      setTooltipClass(newClass);
    }
  }, [isVisible]);

  return (
    <div 
      ref={containerRef}
      className="help-tooltip-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`help-tooltip help-tooltip-${position} ${tooltipClass}`}
        >
          <div className="help-tooltip-content">
            <div className="help-tooltip-term">{term}</div>
            <div className="help-tooltip-definition">{definition}</div>
          </div>
        </div>
      )}
    </div>
  );
}; 