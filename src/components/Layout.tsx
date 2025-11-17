import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SiteNavbar from "./SiteNavbar";

const Layout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin";

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoginPage && <SiteNavbar />}
      <Outlet />
    </div>
  );
};

export default Layout;
