import { Palette, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar({ mobileSidebarOpen, setMobileSidebarOpen, menuItems }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`fixed lg:static z-50 h-full w-72 bg-white/98 backdrop-blur-2xl border-r border-gray-200/70 flex flex-col transition-transform duration-300 ${
        mobileSidebarOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-200/70 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Drawly</span>
        </div>
        
        <button
          onClick={() => {
            setMobileSidebarOpen(false);
            document.dispatchEvent(new CustomEvent("close-mobile-sidebar")); // ADD THIS LINE
          }}
          className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, i) => {
          const isActive = item.path === location.pathname;

          return (
            <button
              key={i}
              onClick={() => {
                navigate(item.path);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-teal-800 text-white shadow-lg"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div
        onClick={() => navigate("/profile")}
        className="p-4 border-t border-gray-200/70 cursor-pointer hover:bg-gray-100/60 transition rounded-b-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md">
            AR
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Alex Rivera</p>
            <p className="text-xs text-gray-500">alex@drawly.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
