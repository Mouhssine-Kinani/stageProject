import "./header.css";
import { useLayout } from "@/contexts/LayoutContext";

export default function Header() {
  const { toggleSidebar, toggleNotification } = useLayout();

  return (
    <header className="area-header">
      <div className="div1">
        <button onClick={toggleSidebar}>
          <img src="/headerIcon/side.svg" alt="Toggle sidebar" />
        </button>
        <img src="/headerIcon/star.svg" alt="" />
        <p>dashboard / digital products</p>
      </div>
      <div className="div2">
        <input type="text" placeholder="  Search" className="search-input" />
        <div className="iconsHolder">
          <button >
            <img src="/headerIcon/them.svg" alt="Theme" />
          </button>
          <img src="/headerIcon/history.svg" alt="History" />
          <button onClick={toggleNotification}>
            <img src="/headerIcon/notification.svg" alt="Notifications" />
          </button>
          <button onClick={toggleNotification}>
            <img src="/headerIcon/side.svg" alt="Profile" />
          </button>
        </div>
      </div>
    </header>
  );
}
