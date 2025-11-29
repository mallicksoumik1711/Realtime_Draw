import { Bell, Menu, Search } from "lucide-react";

function Navbar({ setMobileSidebarOpen }) {
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

                {/* Search */}
                <div className="hidden lg:block flex-1 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search drawings or users..."
                            className="pl-12 pr-6 py-3 bg-gray-100/80 rounded-xl w-full focus:outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Notifications */}
                <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition">
                    <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-teal-600 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>
    );
}

export default Navbar;