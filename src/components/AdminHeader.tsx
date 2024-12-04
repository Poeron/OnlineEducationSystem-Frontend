import React from "react";

type HeaderProps = {
  title: string;
  onCreate?: () => void;
  children?: React.ReactNode;
};

const AdminHeader: React.FC<HeaderProps> = ({ title, onCreate, children }) => {
  return (
    <header className="admin-header">
      <div className="header-content">
        <h1>{title}</h1>
        {onCreate && (
          <button onClick={onCreate} className="create-btn">
            Create New
          </button>
        )}
      </div>
      {children && <div className="header-children">{children}</div>}
    </header>
  );
};

export default AdminHeader;
