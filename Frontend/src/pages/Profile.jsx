import { motion } from "framer-motion"; //eslint-disable-line no-unused-vars
import {
  LogOut,
  Mail,
  Clock,
  CheckCircle,
  Plus,
  Edit2,
  Briefcase,
  GraduationCap,
  Shield,
  Languages,
  Camera,
  ExternalLink,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function FreelancerProfile() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <>
      {/* Mobile Header – Only avatar + hamburger */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50 flex items-center justify-between px-5 py-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu className="w-6 h-6 text-gray-800" />
        </button>

        <div className="relative">
          <img
            src="https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8="
            alt="Jane Smith"
            className="w-12 h-12 rounded-full shadow-lg border-2 border-white"
          />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
      </header>

      {/* Desktop Header – unchanged */}
      <header className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8="
                  alt="Jane Smith"
                  className="w-16 h-16 rounded-full ring-4 ring-white shadow-lg"
                />
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Jane Smith</h1>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Jane@smith.com
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Available now
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium">
                <ExternalLink className="w-4 h-4" />
                View Public Profile
              </button>
              <button className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 text-sm font-medium">
                <Settings className="w-4 h-4" />
                Profile Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar – slides in */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Profile</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Profile info in mobile menu */}
            <div className="px-5 py-2 border-b">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <img
                    src="https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8="
                    alt="Jane Smith"
                    className="w-12 h-12 rounded-full"
                  />
                  <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></span>
                </div>
                <div className="text-right">
                  <h3 className="font-lg text-lg">Jane Smith</h3>
                  <p className="text-sm text-gray-600">Jane@smith.com</p>
                  <p className="text-xs text-green-600 mt-1">Available now</p>
                </div>
              </div>
            </div>

            {/* Action buttons moved here on mobile */}
            <div className="px-4 py-2 space-y-2 border-b">
              <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-medium">
                <ExternalLink className="w-4 h-4" />
                View Public Profile
              </button>
              <button className="w-full px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2 text-sm font-medium">
                <Settings className="w-4 h-4" />
                Profile Settings
              </button>
            </div>

            {/* Original sidebar content */}
            <div className="p-5 space-y-6">
              {/* Video Introduction */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    Video Introduction
                  </h3>
                  <button className="text-teal-600">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-gray-100 border-2 border-dashed rounded-xl h-32 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-gray-400" />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Hours per week
                  </h3>
                  <p className="text-gray-600 text-sm">More than 30 hrs/week</p>
                  <p className="text-xs text-gray-500 mt-1">
                    No contract-to-hire preference set
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Languages className="w-5 h-5 text-teal-600" />
                    Languages
                  </h3>
                  <p className="text-sm">
                    <strong>English:</strong> Native or Bilingual
                  </p>
                  <p className="text-sm">
                    <strong>Spanish:</strong> Fluent
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-teal-600" />
                    Verifications
                  </h3>
                  <p className="text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Military Veteran
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-teal-600" />
                    Education
                  </h3>
                  <div>
                    <p className="font-medium text-sm">ABC University</p>
                    <p className="text-xs text-gray-600">
                      Bachelor of Arts (BA), Business Administration
                    </p>
                    <p className="text-xs text-gray-500">2014-2018</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-8 flex items-center justify-center gap-3 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Layout – unchanged on desktop, full-width on mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar – only visible on lg+ */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              {/* Same content as before – unchanged */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    Video Introduction
                  </h3>
                  <button className="text-teal-600 hover:text-teal-700">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-gray-100 border-2 border-dashed rounded-xl h-32 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-gray-400" />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Hours per week
                  </h3>
                  <p className="text-gray-600 text-sm">More than 30 hrs/week</p>
                  <p className="text-xs text-gray-500 mt-1">
                    No contract-to-hire preference set
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Languages className="w-5 h-5 text-teal-600" />
                    Languages
                  </h3>
                  <p className="text-sm">
                    <strong>English:</strong> Native or Bilingual
                  </p>
                  <p className="text-sm">
                    <strong>Spanish:</strong> Fluent
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-teal-600" />
                    Verifications
                  </h3>
                  <p className="text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Military Veteran
                    <button className="text-teal-600">
                      <Plus className="w-4 h-4" />
                    </button>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-teal-600" />
                    Education
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">ABC University</p>
                      <p className="text-xs text-gray-600">
                        Bachelor of Arts (BA), Business Administration
                      </p>
                      <p className="text-xs text-gray-500">2014-2018</p>
                    </div>
                    <button className="text-teal-600">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-8 flex items-center justify-center gap-3 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content – full width on mobile */}
          <main className="lg:col-span-3 space-y-8">
            {/* Title + Rate */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    Professional Virtual Assistant
                    <button className="text-gray-500 hover:text-gray-700">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </h2>
                  <p className="text-3xl font-bold text-teal-600 mt-2">
                    $12.00/hr
                  </p>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <Edit2 className="w-6 h-6" />
                </button>
              </div>

              <p className="mt-6 text-gray-700 leading-relaxed">
                Highly skilled and motivated virtual assistant with a proven
                track record of providing exceptional administrative support.
                Excellent communication skills, exceptional attention to detail,
                and a strong ability to prioritize tasks effectively. Dedicated
                to delivering outstanding results and exceeding client
                expectations.
              </p>
              <button className="mt-4 text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1">
                <Edit2 className="w-4 h-4" /> Edit description
              </button>
            </div>

            {/* Work History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Work History
              </h3>
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                No work yet. Once you start getting hired on Upwork, your work
                with clients will show up here.
              </p>
              <button className="mt-4 text-teal-600 font-medium hover:text-teal-700">
                Start your search
              </button>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                Portfolio
                <button className="text-teal-600">
                  <Plus className="w-6 h-6" />
                </button>
              </h3>
              <div className="py-12">
                <Briefcase className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <p className="text-gray-600 max-w-md mx-auto">
                  Talent who add portfolios to their profile are{" "}
                  <strong>more likely to win work (+20%)</strong>
                </p>
                <button className="mt-6 text-teal-600 font-semibold hover:text-teal-700">
                  Add a portfolio
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
