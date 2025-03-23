'use client';
import { useLayout } from "@/contexts/LayoutContext";
import "./notification.css"

export default function NotificationPanel() {
  const { isNotificationOpen } = useLayout();
  

  return (
    <div className={`notification-panel ${!isNotificationOpen ? 'closed' : ''}`}>
      <div className="not-container  flex flex-col p-2">
        <div className="notificationList flex flex-col p-1">
          <h3>Notication gggg</h3>
          <div className="notifications flex flex-col p-1">
            content
          </div>
        </div>
        {/* <div className="activitiesList flex flex-col p-1">
          <h3>Activities</h3>
          <div className="activities flex flex-col p-1">
            content
          </div>
        </div>
        <div className="contactsList flex flex-col p-1">
          <h3>Contacts</h3>
          <div className="contacts flex flex-col p-1">
            content
          </div>
        </div> */}
      </div>
    </div>
  );
}