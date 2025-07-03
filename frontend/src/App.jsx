import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { WalletProvider } from "./context/WalletContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import MoodTracker from "./pages/MoodTracker";
import Games from "./pages/Games";
import Chatbot from "./pages/Chatbot";
import Rewards from "./pages/RewardsPage";
import AdminPanel from "./pages/AdminPanel";
import EducatorDashboard from "./pages/EducatorDashboard";
import Notifications from "./pages/Notifications";
import Journal from "./pages/Journal";
import Settings from "./pages/Setting";
import Profile from "./pages/Profile";
import WalletPage from "./pages/WalletPage";
import StudentManagement from "./pages/StudentManagement";
import EducatorTools from "./pages/EducatorTools";
import RedeemPage from "./pages/RedeemPage";
import RedemptionRequests from "./pages/RedemptionRequests";
import PendingEducators from "./pages/PendingEducators";
import Leaderboard from "./pages/Leaderboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRedemptions from "./pages/AdminRedemptions";
import AllEducator from "./pages/AllEducator";
import AllStudents from "./pages/AllStudents";
import StudentGame from "./pages/StudentGame";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <WalletProvider>
          <Router>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Student Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
                <Route path="/mood" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
                <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
                <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
                <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
                <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
                <Route path="/student-management" element={<ProtectedRoute roles={['admin', 'educator']}><StudentManagement /></ProtectedRoute>} />
                <Route path="/educator-tools" element={<ProtectedRoute roles={['educator']}><EducatorTools /></ProtectedRoute>} />
                <Route path="/redeem" element={<ProtectedRoute><RedeemPage /></ProtectedRoute>} />
                <Route path="/redemption-requests" element={<ProtectedRoute roles={['admin', 'educator']}><RedemptionRequests /></ProtectedRoute>} />
                <Route path="/pending-educators" element={<ProtectedRoute roles={['admin']}><PendingEducators /></ProtectedRoute>} />
                <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                <Route path="/student-game" element={<ProtectedRoute><StudentGame /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/redemptions" element={<ProtectedRoute roles={['admin']}><AdminRedemptions /></ProtectedRoute>} />
                <Route path="/admin/educators" element={<ProtectedRoute roles={['admin']}><AllEducator /></ProtectedRoute>} />
                <Route path="/admin/students" element={<ProtectedRoute roles={['admin']}><AllStudents /></ProtectedRoute>} />

                {/* Educator Routes */}
                <Route path="/educator" element={<ProtectedRoute roles={['educator']}><EducatorDashboard /></ProtectedRoute>} />
              </Routes>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
          </Router>
        </WalletProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
