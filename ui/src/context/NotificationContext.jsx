import { createContext, useContext, useState, useCallback } from 'react';
import Notification from '@/components/notification/notification';

// Create context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Provider component
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // Add a notification
  const addNotification = useCallback((type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    return id;
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Helper functions for different notification types
  const showSuccess = useCallback((message) => {
    return addNotification('success', message);
  }, [addNotification]);

  const showError = useCallback((message) => {
    return addNotification('error', message);
  }, [addNotification]);

  const showInfo = useCallback((message) => {
    return addNotification('info', message);
  }, [addNotification]);

  const showWarning = useCallback((message) => {
    return addNotification('warning', message);
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning
      }}
    >
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
        {notifications.map(({ id, type, message }) => (
          <Notification
            key={id}
            type={type}
            message={message}
            onClose={() => removeNotification(id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
} 