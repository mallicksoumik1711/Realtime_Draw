import { Palette, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Sidebar({ mobileSidebarOpen, setMobileSidebarOpen, menuItems }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Desktop collapse state (only affects lg+ screens)
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed lg:static z-50 h-full bg-white/98 backdrop-blur-2xl shadow-md border-r border-gray-200/70 flex flex-col transition-all duration-300 ${
        mobileSidebarOpen
          ? "w-72 translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      } ${collapsed ? "lg:w-20" : "lg:w-72"}`}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-200/70 flex items-center justify-between shadow-md">
        <div
          className={`flex items-center gap-3 transition-all duration-300 ${
            collapsed ? "lg:opacity-0 lg:w-0 lg:overflow-hidden" : ""
          }`}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
            Drawly
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Collapse Toggle - only visible on desktop */}
          <button
            onClick={() => setCollapsed(prev => !prev)} // Fixed syntax
            className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>

          {/* Close button - mobile only */}
          <button
            onClick={() => {
              setMobileSidebarOpen(false);
              document.dispatchEvent(new CustomEvent("close-mobile-sidebar"));
            }}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 shadow-md overflow-hidden">
        {menuItems.map((item, i) => {
          const isActive =
            item.path === location.pathname ||
            (item.label === "Recent" && location.pathname.startsWith("/draw/"));

          return (
            <button
              key={i}
              onClick={() => {
                navigate(item.path);
                setMobileSidebarOpen(false);
              }}
              className={`relative w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all group ${
                isActive
                  ? "bg-teal-800 text-white shadow-lg"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />

              {/* Label */}
              <span
                className={`font-medium transition-all duration-300 ${
                  collapsed
                    ? "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                    : ""
                }`}
              >
                {item.label}
              </span>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <span className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div
        onClick={() => navigate("/profile")}
        className="p-4 border-t border-gray-200/70 cursor-pointer hover:bg-gray-100/60 transition group relative"
      >
        <div className={`flex items-center gap-3 transition-all duration-300 ${collapsed ? "lg:justify-center" : ""}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md flex-shrink-0">
            AR
          </div>

          <div
            className={`transition-all duration-300 ${
              collapsed ? "lg:opacity-0 lg:w-0 lg:overflow-hidden" : ""
            }`}
          >
            <p className="text-sm font-semibold text-gray-900">Alex Rivera</p>
            <p className="text-xs text-gray-500">alex@drawly.com</p>
          </div>
        </div>

        {/* Tooltip for profile when collapsed */}
        {collapsed && (
          <span className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
            Alex Rivera
          </span>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;