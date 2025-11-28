import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoutes";

import Dashboard from "./pages/dashboard/Dashboard";
import Sessions from "./pages/dashboard/Sessions";
import MyArt from "./pages/dashboard/MyArt";
import Recent from "./pages/dashboard/Recent";
import Users from "./pages/dashboard/Users";

import AppLayout from "./layouts/AppLayout";

import DrawRoom from "./pages/DrawRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recent"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Recent />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Sessions />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/myart"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MyArt />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Users />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/draw/:roomId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DrawRoom />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
