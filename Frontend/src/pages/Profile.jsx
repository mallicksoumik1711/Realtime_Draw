
import { motion } from 'framer-motion'; //eslint-disable-line no-unused-vars
import {
  LogOut,
  Bell,
  User,
  Palette,
  Settings,
  Mail,
  Globe,
  Calendar,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Alex Rivera");
  const [email] = useState("alex.rivera@drawly.com");
  const [bio, setBio] = useState("Passionate digital artist & real-time collaborator. Love creating with friends across the globe.");
  const [tempName, setTempName] = useState(name);
  const [tempBio, setTempBio] = useState(bio);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin', { replace: true });
  };

  const handleSave = () => {
    setName(tempName);
    setBio(tempBio);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 relative overflow-hidden">

      {/* SAME PREMIUM BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-white to-teal-50/20" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(203 213 225) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(203 213 225) 1px, transparent 1px)
            `,
            backgroundSize: '70px 70px',
          }}
        />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 6 + i * 0.5, repeat: Infinity, delay: i * 0.2 }}
            className="absolute"
            style={{
              top: `${10 + (i * 8)}%`,
              left: `${5 + (i % 10) * 10}%`,
              width: '4px',
              height: '4px',
              background: i % 3 === 0 ? '#14b8a6' : '#0891b2',
              borderRadius: '50%',
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-gray-200/70">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-800 rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Drawly</h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition">
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-teal-600 rounded-full border-2 border-white"></span>
            </button>

            {/* PROFILE AVATAR + DROPDOWN */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{name}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl border-3 border-white shadow-lg">
                {name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN PROFILE SECTION */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100/60 overflow-hidden"
        >
          {/* Hero Cover */}
          <div className="h-48 bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-0 left-8 translate-y-1/2">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 px-8 pb-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                {isEditing ? (
                  <input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="text-4xl font-bold text-gray-900 bg-gray-100 rounded-lg px-3 py-1"
                  />
                ) : (
                  <h1 className="text-4xl font-bold text-gray-900">{name}</h1>
                )}
                <p className="text-teal-700 font-medium mt-2">Digital Artist • Collaborator</p>
              </div>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} className="p-3 bg-teal-800 text-white rounded-xl hover:bg-teal-900 transition">
                      <Check className="w-5 h-5" />
                    </button>
                    <button onClick={() => { setIsEditing(false); setTempName(name); setTempBio(bio); }} className="p-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-teal-800 text-white rounded-xl hover:bg-teal-900 transition font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-10">
              {isEditing ? (
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-teal-100"
                />
              ) : (
                <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">{bio}</p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Drawings Created", value: "127", icon: Palette },
                { label: "Active Sessions", value: "3", icon: Globe },
                { label: "Collaborators", value: "42", icon: User },
                { label: "Member Since", value: "Jan 2025", icon: Calendar },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 text-center border border-teal-100"
                >
                  <stat.icon className="w-8 h-8 text-teal-700 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Logout Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 group"
              >
                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition" />
                Logout
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Profile;