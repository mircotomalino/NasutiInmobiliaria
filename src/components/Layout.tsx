import React from 'react';
import { Outlet } from 'react-router-dom';
import SiteNavbar from './SiteNavbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNavbar />
      <Outlet />
    </div>
  );
};

export default Layout;


