// import { motion } from 'framer-motion'; //eslint-disable-line no-unused-vars
// import {
//     Palette, Bell, Search, Menu, Home, Clock, Users, Brush, Settings, Plus, Activity, TrendingUp, X
// } from 'lucide-react';
// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// export default function Dashboard() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

//     const menuItems = [
//         { icon: Home, label: "Dashboard", path: "/dashboard", active: true },   // keep active true only for Dashboard
//         { icon: Clock, label: "Recent", path: "/recent" },
//         { icon: Users, label: "Sessions", path: "/sessions" },
//         { icon: Brush, label: "My Art", path: "/myart" },
//         { icon: Users, label: "Users", path: "/users" },
//     ];

//     return (
//         <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 relative overflow-hidden flex">

//             {/* Background */}
//             <div className="absolute inset-0 pointer-events-none overflow-hidden">
//                 <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-white to-teal-50/20" />
//                 <div className="absolute inset-0 opacity-50"
//                     style={{
//                         backgroundImage: `linear-gradient(to right, rgb(203 213 225) 1px, transparent 1px),
//                               linear-gradient(to bottom, rgb(203 213 225) 1px, transparent 1px)`,
//                         backgroundSize: '60px 60px',
//                     }}
//                 />
//             </div>

//             {/* MOBILE DARK OVERLAY */}
//             {mobileSidebarOpen && (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     onClick={() => setMobileSidebarOpen(false)}
//                     className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//                 />
//             )}

//             {/* SIDEBAR — Desktop: fixed | Mobile: drawer */}
//             <aside className={`fixed lg:static lg:translate-x-0 z-50 h-full w-72 bg-white/98 backdrop-blur-2xl border-r border-gray-200/70 flex flex-col transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//                 }`}>
//                 {/* Header */}
//                 <div className="p-5 border-b border-gray-200/70 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center">
//                             <Palette className="w-5 h-5 text-white" />
//                         </div>
//                         <span className="text-lg font-bold text-gray-900">Drawly</span>
//                     </div>
//                     <button
//                         onClick={() => setMobileSidebarOpen(false)}
//                         className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
//                     >
//                         <X className="w-5 h-5 text-gray-700" />
//                     </button>
//                 </div>

//                 {/* Navigation */}
//                 <nav className="flex-1 px-4 py-6 space-y-2">
//                     {menuItems.map((item, i) => {
//                         const isActive = item.path === location.pathname;

//                         return (
//                             <button
//                                 key={i}
//                                 onClick={() => {
//                                     navigate(item.path);
//                                     setMobileSidebarOpen(false);
//                                 }}
//                                 className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${isActive
//                                     ? 'bg-teal-800 text-white shadow-lg'
//                                     : 'hover:bg-gray-100 text-gray-700'
//                                     }`}
//                             >
//                                 <item.icon className="w-5 h-5 flex-shrink-0" />
//                                 <span className="font-medium">{item.label}</span>
//                             </button>
//                         );
//                     })}
//                 </nav>

//                 {/* User Profile */}
//                 <div
//                     onClick={() => navigate("/profile")}
//                     className="p-4 border-t border-gray-200/70 cursor-pointer hover:bg-gray-100/60 transition rounded-b-xl"
//                 >
//                     <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md">
//                             AR
//                         </div>
//                         <div>
//                             <p className="text-sm font-semibold text-gray-900">Alex Rivera</p>
//                             <p className="text-xs text-gray-500">alex@drawly.com</p>
//                         </div>
//                     </div>
//                 </div>

//             </aside>

//             {/* MAIN CONTENT */}
//             <div className="flex-1 flex flex-col">
//                 {/* NAVBAR */}
//                 <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/70 px-4 sm:px-6 py-4">
//                     <div className="flex items-center justify-between gap-4">
//                         {/* Mobile Hamburger */}
//                         <button
//                             onClick={() => setMobileSidebarOpen(true)}
//                             className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
//                         >
//                             <Menu className="w-6 h-6 text-gray-700" />
//                         </button>

//                         {/* Search — Only on large screens */}
//                         <div className="hidden lg:block flex-1 max-w-xl">
//                             <div className="relative">
//                                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search drawings or users..."
//                                     className="pl-12 pr-6 py-3 bg-gray-100/80 rounded-xl w-full focus:outline-none text-sm"
//                                 />
//                             </div>
//                         </div>

//                         {/* Notification Bell */}
//                         <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition">
//                             <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
//                             <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-teal-600 rounded-full border-2 border-white"></span>
//                         </button>
//                     </div>
//                 </header>

//                 {/* MAIN CONTENT — Fixed & Super Clear Header */}
//                 <main className="flex-1 p-5 sm:p-6 overflow-y-auto bg-gray-50/30">
//                     <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

//                         {/* Welcome + CTA — Now perfectly visible */}
//                         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-200/50">

//                             <div className="space-y-2">
//                                 <h1 className="text-sm sm:text-xl font-bold text-gray-900 leading-tight">
//                                     Welcome back!
//                                 </h1>
//                                 <p className="text-lg sm:text-md text-gray-700 font-medium">
//                                     Ready to draw something amazing today?
//                                 </p>
//                             </div>

//                             {/* New Drawing Button — Bold & Impossible to Miss */}
//                             <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 className="flex items-center gap-3 px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white text-md rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-200 whitespace-nowrap"
//                             >
//                                 <Plus className="w-6 h-6" />
//                                 New Drawing
//                             </motion.button>
//                         </div>

//                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
//                             {[
//                                 { label: "Active", value: "6", change: "+2 today", icon: Activity },
//                                 { label: "Drawings", value: "248", change: "+12 week", icon: Palette },
//                                 { label: "Online", value: "89", change: "42 now", icon: Users },
//                                 { label: "Streak", value: "12d", change: "Keep going!", icon: TrendingUp },
//                             ].map((stat, i) => (
//                                 <div key={i} className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-md border border-gray-100/70">
//                                     <div className="flex items-center justify-between mb-2">
//                                         <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 text-teal-700" />
//                                         <span className="text-xs text-teal-600 font-medium">{stat.change}</span>
//                                     </div>
//                                     <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                                     <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-10 text-center">
//                             <Palette className="w-16 h-16 sm:w-20 sm:h-20 text-teal-600 mx-auto mb-4 opacity-40" />
//                             <h2 className="text-lg sm:text-xl font-bold text-gray-800">Your canvas is ready</h2>
//                             <p className="text-gray-600 text-sm sm:text-base mt-2">Start drawing or join a live session</p>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// }



import { motion } from "framer-motion"; //eslint-disable-line no-unused-vars
import { Palette, Activity, TrendingUp, Users, Plus } from "lucide-react";

function Dashboard() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-200/50">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Welcome back!</h1>
                    <p className="text-gray-700 mt-1">Ready to draw something amazing today?</p>
                </div>


                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-xl"
                >
                    <Plus className="w-6 h-6" /> New Drawing
                </motion.button>
            </div>


            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Active", value: "6", change: "+2 today", icon: Activity },
                    { label: "Drawings", value: "248", change: "+12 week", icon: Palette },
                    { label: "Online", value: "89", change: "42 now", icon: Users },
                    { label: "Streak", value: "12d", change: "Keep going!", icon: TrendingUp },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className="w-7 h-7 text-teal-700" />
                            <span className="text-xs text-teal-600 font-medium">{stat.change}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-10 text-center">
                <Palette className="w-16 h-16 sm:w-20 sm:h-20 text-teal-600 mx-auto mb-4 opacity-40" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Your canvas is ready</h2>
                <p className="text-gray-600 text-sm sm:text-base mt-2">Start drawing or join a live session</p>
            </div>
        </div>
    );
}

export default Dashboard;