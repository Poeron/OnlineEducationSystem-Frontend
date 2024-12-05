import React, { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

type AdminLayoutProps = {
  children?: ReactNode;
};

const UserLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="user-layout">
      <Navbar />
      <div className="user-content">
        <main className="user-main">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
