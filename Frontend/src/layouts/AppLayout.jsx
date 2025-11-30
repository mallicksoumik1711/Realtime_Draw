import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Home, Clock, Users, Brush } from "lucide-react";

import { useLocation } from "react-router-dom";

function AppLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Listen for sidebar open request from DrawRoom
  useEffect(() => {
    const openSidebar = () => setMobileSidebarOpen(true);
    document.addEventListener("open-mobile-sidebar", openSidebar);
    return () =>
      document.removeEventListener("open-mobile-sidebar", openSidebar);
  }, []);

  const hideNavbar = location.pathname.startsWith("/draw/");

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Clock, label: "Recent", path: "/recent" },
    { icon: Users, label: "Sessions", path: "/sessions" },
    { icon: Brush, label: "Art", path: "/myart" },
    { icon: Users, label: "Users", path: "/users" },
  ];

  return (
    <div className="h-screen flex bg-gray-50 relative overflow-hidden">
      {!location.pathname.startsWith("/draw/") && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-white to-teal-50/20" />
          <div
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage: `linear-gradient(to right, rgb(203 213 225) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgb(203 213 225) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>
      )}

      {/* Dark backdrop when mobile sidebar open */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => {
            setMobileSidebarOpen(false);
            document.dispatchEvent(new CustomEvent("close-mobile-sidebar")); // ADD THIS LINE
          }}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        menuItems={menuItems}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Navbar setMobileSidebarOpen={setMobileSidebarOpen} /> */}
        {!hideNavbar && <Navbar setMobileSidebarOpen={setMobileSidebarOpen} />}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 bg-gray-50/30">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
