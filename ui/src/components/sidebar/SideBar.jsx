import Link from "next/link";
import "./sideBar.css";

import { useLayout } from "@/contexts/LayoutContext";

function SideBar() {
  const { isSidebarOpen } = useLayout();

  return (
    <aside className={`area-sidebar ${!isSidebarOpen ? "closed" : "p-4"}`}>
      <div className="profile-sidebare">
        <div className="sb-s1">
          <img src="" alt="profile" className="sidebare-img-profile" />
          <div className="userName-container">
            <h2>user name</h2>
          </div>
        </div>
        <div className="sb-s2">
          <ul>
            <li>Overview</li>
            <li>Log</li>
          </ul>
        </div>
      </div>

      <div className="menu">
        <h2>Menu</h2>
        <ul>
          <Link href="/home">
            <li>
              <img src="/sideBarIcon/ChartPieSlice.svg" alt="icon" />
              Accueil
            </li>
          </Link>
          <Link href="/products">
            <li>
              <img src="/sideBarIcon/box.svg" alt="icon" />
              Products
            </li>
          </Link>
          <Link href="/reminders">
            <li>
              <img src="/sideBarIcon/calendar.svg" alt="icon" />
              Remiders
            </li>
          </Link>
          <Link href="/clients">
            <li>
              <img src="/sideBarIcon/building-skyscraper.svg" alt="icon" />
              Clients
            </li>
          </Link>
          <Link href="/users">
            <li>
              <img src="/sideBarIcon/users.svg" alt="icon" />
              Utilisateurs
            </li>
          </Link>
          <Link href="">
            <li>
              <img src="/sideBarIcon/settings.svg" alt="icon" />
              Reglage
            </li>
          </Link>
        </ul>
      </div>
    </aside>
  );
}

export default SideBar;
