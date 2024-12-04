import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import "@/assets/css/AdminLayout.css";

type AdminLayoutProps = {
  children?: ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <main className="admin-main">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
