import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@jbaluch/components';
import './SelectDate.css';

interface SelectDateProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: string;
  style?: React.CSSProperties;
  maxDate?: string; // Format YYYY-MM-DD
}

export const SelectDate: React.FC<SelectDateProps> = ({
  label,
  placeholder = "Select date",
  value = '',
  onChange,
  required = false,
  error,
  style,
  maxDate
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Fonction pour obtenir la date d'aujourd'hui au format YYYY-MM-DD
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Utiliser la date d'aujourd'hui par défaut si aucune valeur n'est fournie
  const effectiveValue = value || getTodayDate();

  // Appeler onChange avec la date d'aujourd'hui si aucune valeur n'est fournie
  useEffect(() => {
    if (!value && onChange) {
      onChange(getTodayDate());
    }
  }, [value, onChange]);

  // Format date for display (DD/MM/YYYY)
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format date for value (YYYY-MM-DD)
  const formatDateForValue = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if a date is selectable (not in the future)
  const isDateSelectable = (date: Date): boolean => {
    if (!maxDate) return true;
    const maxDateObj = new Date(maxDate);
    return date <= maxDateObj;
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (!isDateSelectable(date)) return; // Prevent selection of future dates
    const formattedDate = formatDateForValue(date);
    onChange?.(formattedDate);
    setShowCalendar(false);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setShowCalendar(true);
    // Set current month based on selected value or current date
    if (effectiveValue) {
      const selectedDate = new Date(effectiveValue);
      if (!isNaN(selectedDate.getTime())) {
        setCurrentMonth(selectedDate);
      }
    }
  };

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const days = generateCalendarDays();
  const selectedDate = effectiveValue ? new Date(effectiveValue) : null;
  const today = new Date();

  // Month/Year navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="select-date-container" ref={containerRef} style={style}>
      <Input
        label={label}
        placeholder={placeholder}
        value={formatDateForDisplay(effectiveValue)}
        onChange={() => {}} // Read-only, controlled by calendar
        onFocus={handleInputFocus}
        required={required}
        error={error}
        readOnly
        style={{ cursor: 'pointer' }}
      />
      
      {showCalendar && (
        <div className="select-date-calendar" ref={calendarRef}>
          {/* Calendar Header */}
          <div className="calendar-header">
            <button 
              type="button"
              className="calendar-nav-button" 
              onClick={goToPreviousMonth}
            >
              ←
            </button>
            
            <div className="calendar-month-year">
              <select 
                value={currentMonth.getMonth()} 
                onChange={(e) => setCurrentMonth(new Date(currentMonth.getFullYear(), parseInt(e.target.value)))}
                className="calendar-month-select"
              >
                {monthNames.map((month, index) => (
                  <option key={month} value={index}>{month}</option>
                ))}
              </select>
              
              <select 
                value={currentMonth.getFullYear()} 
                onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth()))}
                className="calendar-year-select"
              >
                {Array.from({ length: 20 }, (_, i) => currentMonth.getFullYear() - 10 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <button 
              type="button"
              className="calendar-nav-button" 
              onClick={goToNextMonth}
            >
              →
            </button>
          </div>
          
          {/* Calendar Days Header */}
          <div className="calendar-days-header">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="calendar-day-header">{day}</div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="calendar-days-grid">
            {days.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isSelected = selectedDate && 
                day.getDate() === selectedDate.getDate() &&
                day.getMonth() === selectedDate.getMonth() &&
                day.getFullYear() === selectedDate.getFullYear();
              const isToday = 
                day.getDate() === today.getDate() &&
                day.getMonth() === today.getMonth() &&
                day.getFullYear() === today.getFullYear();
              const isSelectable = isDateSelectable(day);
              
              return (
                <button
                  key={index}
                  type="button"
                  className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${!isSelectable ? 'disabled' : ''}`}
                  onClick={() => handleDateSelect(day)}
                  disabled={!isSelectable}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};