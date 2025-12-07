import { Bell, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar({ setMobileSidebarOpen }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/70 px-4 sm:px-6 py-4 shadow-md">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* SEARCH BAR  */}
        <div className="hidden lg:flex flex-1 max-w-xl">
          <div className="relative w-full group">
            {/* Search Icon */}
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 
                       group-focus-within:text-teal-600 group-focus-within:scale-110 
                       transition-all duration-200 pointer-events-none"
            />

            {/* Input */}
            <input
              type="text"
              placeholder="Search drawings or users..."
              className="w-full pl-12 pr-5 py-3 bg-gray-100/80 rounded-xl focus:outline-none 
                 focus:bg-white focus:shadow-2xl 
                 focus:scale-[1.025] text-sm font-medium placeholder-gray-500
                 transition-all duration-300 ease-out"
            />

            {/* Floating shadow layer — appears only on focus */}
            <div
              className="absolute inset-0 rounded-xl shadow-lg opacity-0 
                    group-focus-within:opacity-100 scale-95 
                    group-focus-within:scale-100 pointer-events-none
                    transition-all duration-300 ease-out 
                    bg-white/50 blur-xl"
            />
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition" onClick={()=>navigate("/notification")}>
          <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-teal-600 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
