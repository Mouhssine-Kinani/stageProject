import Link from "next/link";
import "./sideBar.css";


import { useLayout } from "@/contexts/LayoutContext";

function SideBar() {
  const { isSidebarOpen } = useLayout();

  return (
    <aside className={`area-sidebar ${!isSidebarOpen ? 'closed' : ''}`}>
      {/* Your existing sidebar content */}
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
            <li>
              <img src="/sideBarIcon/ChartPieSlice.svg" alt="icon" /><Link href="">Accueil</Link>
            </li>
            <li>
              <img src="/sideBarIcon/box.svg" alt="icon" /><Link href="">Products</Link>
            </li>
            <li>
              <img src="/sideBarIcon/calendar.svg" alt="icon" /><Link href="">Remiders</Link>
            </li>
            <li>
              <img src="/sideBarIcon/building-skyscraper.svg" alt="icon" /><Link href="">Clients</Link>
            </li>
            <li>
              <img src="/sideBarIcon/users.svg" alt="icon" /><Link href="">Utilisateurs</Link>
            </li>
            <li>
              <img src="/sideBarIcon/settings.svg" alt="icon" /><Link href="">Reglage</Link>
            </li>
          </ul>
        </div>

    </aside>
  );
}

export default SideBar;