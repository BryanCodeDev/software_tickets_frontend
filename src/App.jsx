import React, { useContext, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthContext, { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import { LoadingSpinner } from './components/base';
import { useThemeClasses } from './hooks/useThemeClasses';

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tickets = lazy(() => import('./pages/Tickets/Tickets'));
const TicketCalidad = lazy(() => import('./pages/Tickets/TicketCalidad'));
const PurchaseRequests = lazy(() => import('./pages/PurchaseRequests/PurchaseRequests'));
const Inventory = lazy(() => import('./pages/Inventory/Inventory'));
const CorporatePhones = lazy(() => import('./pages/Inventory/CorporatePhones'));
const Tablets = lazy(() => import('./pages/Inventory/Tablets'));
const PDAs = lazy(() => import('./pages/Inventory/PDAs'));
const ActasEntrega = lazy(() => import('./pages/ActasEntrega/ActasEntrega'));
const Documents = lazy(() => import('./pages/Documents/Documents'));
const Credentials = lazy(() => import('./pages/Credentials/Credentials'));
const Users = lazy(() => import('./pages/Users/Users'));
const Roles = lazy(() => import('./pages/Roles/Roles'));
const Trash = lazy(() => import('./pages/Trash/Trash'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Help = lazy(() => import('./pages/Help'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const { conditionalClasses } = useThemeClasses();

  if (loading) return (
    <div className={conditionalClasses({
      light: "flex items-center justify-center min-h-screen bg-linear-to-br from-primary-50 via-primary-50 to-primary-50",
      dark: "flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
    })}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className={conditionalClasses({
          light: "text-secondary-600",
          dark: "text-gray-300"
        })}>Cargando...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const LoadingFallback = () => {
  const { conditionalClasses } = useThemeClasses();
  
  return (
    <div className={conditionalClasses({
      light: "flex items-center justify-center min-h-screen bg-linear-to-br from-slate-100 via-primary-50 to-slate-100",
      dark: "flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
    })}>
      <LoadingSpinner size="lg" color="purple" text="Cargando página..." />
    </div>
  );
};

const AppContent = () => {
  const { conditionalClasses } = useThemeClasses();

  return (
    <div className={conditionalClasses({
      light: "min-h-screen bg-linear-to-br from-primary-50 via-primary-50 to-primary-50",
      dark: "min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
    })}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/tickets" element={
            <ProtectedRoute>
              <Layout>
                <Tickets />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/ticket_calidad" element={
            <ProtectedRoute>
              <Layout>
                <TicketCalidad />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/purchase-requests" element={
            <ProtectedRoute>
              <Layout>
                <PurchaseRequests />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute>
              <Layout>
                <Inventory />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/inventory/:id" element={
            <ProtectedRoute>
              <Layout>
                <Inventory />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/corporate-phones" element={
            <ProtectedRoute>
              <Layout>
                <CorporatePhones />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/tablets" element={
            <ProtectedRoute>
              <Layout>
                <Tablets />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pdas" element={
            <ProtectedRoute>
              <Layout>
                <PDAs />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/actas-entrega" element={
            <ProtectedRoute>
              <Layout>
                <ActasEntrega />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/documents" element={
            <ProtectedRoute>
              <Layout>
                <Documents />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/documents/:id" element={
            <ProtectedRoute>
              <Layout>
                <Documents />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/credentials" element={
            <ProtectedRoute>
              <Layout>
                <Credentials />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/roles" element={
            <ProtectedRoute>
              <Layout>
                <Roles />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/trash" element={
            <ProtectedRoute>
              <Layout>
                <Trash />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/help" element={
            <ProtectedRoute>
              <Layout>
                <Help />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Suspense>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
