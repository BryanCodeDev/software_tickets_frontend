import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NotificationSystem from './common/NotificationSystem';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Si pasa a móvil, forzar sidebar expandido
  useEffect(() => {
    if (!isDesktop && sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  }, [isDesktop, sidebarCollapsed]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        isCollapsed={sidebarCollapsed}
        toggleSidebarCollapse={toggleSidebarCollapse}
      />
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-0 sm:p-1 lg:p-2">
          {children}
        </main>
      </div>
      <NotificationSystem />
    </div>
  );
};

export default Layout;


