// SideBar.js
import Link from "next/link";
import "./sideBar.css";
import { useLayout } from "@/contexts/LayoutContext";
import useUser from "@/hooks/useUser";
import useMounted from "@/hooks/useMounted";

function SideBar() {
  const { isSidebarOpen } = useLayout();
  const mounted = useMounted(); // Ensure client-side only rendering
  const { user, loading, error } = useUser();

  // Prevent rendering until after the client has mounted
  if (!mounted) return null;

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error || !user) {
    console.log("[SideBar] Erreur ou utilisateur non trouvé:", { error, user });
    return <div>Error loading user data</div>;
  }

  console.log("[SideBar] Données utilisateur:", user);

  return (
    <aside className={`area-sidebar ${!isSidebarOpen ? "closed" : "p-4"}`}>
      <div className="profile-sidebare">
        <div className="sb-s1">
          <img
            src={
              user?.logo
                ? `${process.env.NEXT_PUBLIC_URLAPI}/${user.logo.replace(
                    /\\/g,
                    "/"
                  )}`
                : "/user.png"
            }
            alt="profile"
            className="sidebare-img-profile"
            onError={(e) => {
              console.error("[SideBar] Erreur de chargement d'image:", e);
              e.target.src = "/user.png";
            }}
          />

          <div className="userName-container">
            <h2>{user?.fullName || "Utilisateur"}</h2>
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
              Reminders
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
          <Link href="/settings">
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
