import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NotificationSystem from './common/NotificationSystem';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth >= 1024;
    return true;
  });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset collapse state on mobile
  useEffect(() => {
    if (!isDesktop && sidebarCollapsed) setSidebarCollapsed(false);
  }, [isDesktop, sidebarCollapsed]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (!isDesktop && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen, isDesktop]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleSidebarCollapse = () => setSidebarCollapsed(prev => !prev);

  return (
    <div className="flex min-h-screen">
      {/* Skip Link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-700 focus:text-white focus:rounded-lg focus:font-medium"
      >
        Saltar al contenido principal
      </a>

      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isCollapsed={sidebarCollapsed}
        toggleSidebarCollapse={toggleSidebarCollapse}
      />

      {/* Main content area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-18' : 'lg:ml-70'}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <main id="main-content" className="flex-1 p-3 sm:p-4 lg:p-5">
          {children}
        </main>
      </div>

      <NotificationSystem />
    </div>
  );
};

export default Layout;
