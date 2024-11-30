import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: JSX.Element;
  role: "student" | "instructor";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    const redirectPath =
      user.role === "student" ? "/student/home" : "/instructor/home";
    return <Navigate to={redirectPath} state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
