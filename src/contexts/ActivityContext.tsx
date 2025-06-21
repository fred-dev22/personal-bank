import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ActivityContextType {
  showActivity: (message: string) => void;
  hideActivity: () => void;
  isVisible: boolean;
  message: string;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

interface ActivityProviderProps {
  children: ReactNode;
}

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showActivity = (newMessage: string) => {
    setMessage(newMessage);
    setIsVisible(true);
  };

  const hideActivity = () => {
    setIsVisible(false);
    setMessage('');
  };

  return (
    <ActivityContext.Provider value={{
      showActivity,
      hideActivity,
      isVisible,
      message
    }}>
      {children}
    </ActivityContext.Provider>
  );
}; 