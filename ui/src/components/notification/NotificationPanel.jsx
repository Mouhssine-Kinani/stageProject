'use client';
import { useLayout } from "@/contexts/LayoutContext";

export default function NotificationPanel() {
  const { isNotificationOpen } = useLayout();

  return (
    <div className={`notification-panel ${!isNotificationOpen ? 'closed' : ''}`}>
      {/* Your notification content */}
      <div className="notification-content">
        <h3>Notifications</h3>
        <div className="notification-list">
          {/* Add your notifications here */}
          <div>New message received</div>
          <div>System update available</div>
          <div>Payment reminder</div>
        </div>
      </div>
    </div>
  );
}