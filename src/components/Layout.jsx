import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 lg:ml-0 transition-all duration-300">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-0 sm:p-1 lg:p-2">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;