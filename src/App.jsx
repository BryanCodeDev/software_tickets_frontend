import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthContext, { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets/Tickets';
import Inventory from './pages/Inventory/Inventory';
import Documents from './pages/Documents/Documents';
import Credentials from './pages/Credentials/Credentials';
import Users from './pages/Users/Users';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-primary-50 via-primary-50 to-primary-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-secondary-600">Cargando...</p>
    </div>
  </div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <div className="min-h-screen bg-linear-to-br from-primary-50 via-primary-50 to-primary-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                  <div className="flex-1 lg:ml-0 transition-all duration-300">
                    <Navbar toggleSidebar={toggleSidebar} />
                    <main className="p-0 sm:p-1 lg:p-2">
                      <Dashboard />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/tickets" element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                  <div className="flex-1 lg:ml-0 transition-all duration-300">
                    <Navbar toggleSidebar={toggleSidebar} />
                    <main className="p-0 sm:p-1 lg:p-2">
                      <Tickets />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                  <div className="flex-1 lg:ml-0 transition-all duration-300">
                    <Navbar toggleSidebar={toggleSidebar} />
                    <main className="p-0 sm:p-1 lg:p-2">
                      <Inventory />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                  <div className="flex-1 lg:ml-0 transition-all duration-300">
                    <Navbar toggleSidebar={toggleSidebar} />
                    <main className="p-0 sm:p-1 lg:p-2">
                      <Documents />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/credentials" element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                  <div className="flex-1 lg:ml-0 transition-all duration-300">
                    <Navbar toggleSidebar={toggleSidebar} />
                    <main className="p-0 sm:p-1 lg:p-2">
                      <Credentials />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                  <div className="flex-1 lg:ml-0 transition-all duration-300">
                    <Navbar toggleSidebar={toggleSidebar} />
                    <main className="p-0 sm:p-1 lg:p-2">
                      <Users />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                  <div className="flex-1 lg:ml-0 transition-all duration-300">
                    <Navbar toggleSidebar={toggleSidebar} />
                    <main className="p-0 sm:p-1 lg:p-2">
                      <Profile />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                  <div className="flex-1 lg:ml-0 transition-all duration-300">
                    <Navbar toggleSidebar={toggleSidebar} />
                    <main className="p-0 sm:p-1 lg:p-2">
                      <Settings />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                  <div className="flex-1 lg:ml-0 transition-all duration-300">
                    <Navbar toggleSidebar={toggleSidebar} />
                    <main className="p-0 sm:p-1 lg:p-2">
                      <Help />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

