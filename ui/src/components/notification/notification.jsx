import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function Notification({ type = 'info', message, onClose, autoClose = true }) {
  const [isVisible, setIsVisible] = useState(true);
  
  // Auto close notification after 5 seconds if autoClose is true
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, isVisible, onClose]);
  
  // Handle manual close
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  if (!isVisible || !message) return null;
  
  // Define styles based on notification type
  const styles = {
    error: {
      container: 'bg-red-50 border-l-4 border-red-500 text-red-700',
      icon: 'text-red-500'
    },
    success: {
      container: 'bg-green-50 border-l-4 border-green-500 text-green-700',
      icon: 'text-green-500'
    },
    info: {
      container: 'bg-blue-50 border-l-4 border-blue-500 text-blue-700',
      icon: 'text-blue-500'
    },
    warning: {
      container: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700',
      icon: 'text-yellow-500'
    }
  };
  
  const currentStyle = styles[type] || styles.info;
  
  return (
    <div className={`${currentStyle.container} p-4 rounded-md shadow-md mb-4 flex justify-between items-center`}>
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      <button 
        onClick={handleClose}
        className={`${currentStyle.icon} hover:opacity-75 transition-opacity`}
        aria-label="Close notification"
      >
        <X size={18} />

      </button>
      <h1>test</h1>
    </div>
  );
} 